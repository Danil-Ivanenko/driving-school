import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { PostType, PostTypeTranslations, UnitType } from "../../types";
import { GetPostsThunk } from "../../reducers/posts-reducer";

const CreatePostDialog: React.FC = ()  => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [postName, setPostName] = useState<string>('');
    const [postText, setPostText] = useState<string>('');
    const [postType, setPostType] = useState<PostType>(PostType.NEWS);
    const [postDeadline, setPostDeadline] = useState<string>('');
    const [file, setFile] = useState<File| null>(null);
    const posts = useTypedSelector(state => state.posts.posts);
    const [taskIds, setTaskIds] = useState<string[]>([]);
    const [teamTaskIds, setTeamTaskIds] = useState<string[]>([]);

    const [unit, setUnit] = useState<UnitType>(UnitType.DAY);
    const [step, setStep] = useState<number>( 1);
    const [value, setValue] = useState<number>(1);

    const [isP2pEnabled, setIsP2pEnabled] = useState<boolean>(false);
    const [p2pType, setP2pType] = useState<string>('RANDOM');
    const [p2pVisibility, setP2pVisibility] = useState<string>('ALL');
    const [p2pDeadline, setP2pDeadline] = useState<string>('');

    const handlePostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostName(event.target.value); 
    };
    
    const handlePostTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostText(event.target.value); 
    };

    const handlePostTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as PostType;
        setPostType(value);
    };

    const handlePostDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostDeadline(event.target.value); 
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) 
        {
            setFile(files[0]);
        } 
        else 
        {
            setFile(null);
        }
    };

    const dispatch: any = useDispatch()
    const selectedChannel = useTypedSelector(state => state.channels.selectedChannel);

    const CreatePost = async () => {
        const p2pParam = isP2pEnabled && postType === PostType.TASK ? {
            type: p2pType,
            visibility: p2pVisibility,
            p2pDeadline: p2pDeadline !== '' ? `${p2pDeadline}:00.000Z` : undefined
        } : undefined;

        if (postType === PostType.CONTROL) {
            await api.CreatePost(postName, postText, postType, postDeadline, selectedChannel!.id, file, taskIds, teamTaskIds, {unit, step, value})
        } else {
            await api.CreatePost(postName, postText, postType, postDeadline, selectedChannel!.id, file, undefined, undefined, {unit, step, value}, isP2pEnabled, p2pParam)
        }

        setOpen(false)
        setPostName('')
        setPostText('')
        setPostDeadline('')
        setFile(null)
        setTaskIds([])
        setTeamTaskIds([])
        setIsP2pEnabled(false)
        setP2pType('RANDOM')
        setP2pVisibility('ALL')
        setP2pDeadline('')
        dispatch(GetPostsThunk(selectedChannel!.id))
        setValue(1)
        setUnit(UnitType.DAY)
        setStep(1)
    }

    const handleAddPostToList = (postId: string, postType: PostType) => {
    if (postType === PostType.TASK) {
        setTaskIds(prev => {
        if (!prev.includes(postId)) {
            return [...prev, postId];
        }
        return prev;
        });
    } else if (postType === PostType.TEAM_TASK) {
        setTeamTaskIds(prev => {
        if (!prev.includes(postId)) {
            return [...prev, postId];
        }
        return prev;
        });
    }
    };

    const handleRemovePostFromList = (postId: string, postType: PostType) => {
        if (postType === PostType.TASK) {
            setTaskIds(prev => prev.filter(id => id !== postId));
        } else if (postType === PostType.TEAM_TASK) {
            setTeamTaskIds(prev => prev.filter(id => id !== postId));
        }
        };


    return(
        <>

             <div className='course-block' onClick={() => setOpen(true)}  style={{width : "90%"}}> Создать запись</div>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Создать запись</p>
                        
                        <div>
                            <label htmlFor="post-name" >Название записи*</label>
                            <input id="post-name" value={postName}  onChange={handlePostNameChange}/>
                        </div>
                                                
                        <div>
                            <label htmlFor="post-text" >Текст записи*</label>
                            <textarea id="post-text" style={{maxWidth: "100%", minWidth: "100%", maxHeight : "300px"}} value={postText}  onChange={handlePostTextChange}/>
                        </div>
                        
                        <div>
                            <label htmlFor="post-type" >Тип записи*</label>
                            <select value={postType} onChange={handlePostTypeChange}>
                                <option value={PostType.NEWS}>Новость</option>
                                <option value={PostType.TASK}>Задача</option>
                                <option value={PostType.CONTROL}>Контрольная</option>
                            </select>
                        </div>
                                        {postType == PostType.CONTROL && (
                                        <>
                                            <div>
                                            <h3>Доступные для добавления:</h3>
                                            {posts
                                                .filter(post => post.type === PostType.TASK || post.type === PostType.TEAM_TASK)
                                                .map(post => {
                                                const isInTaskList = taskIds.includes(post.id);
                                                const isInTeamTaskList = teamTaskIds.includes(post.id);
                                                
                                                return (
                                                    <div key={post.id} style={{ 
                                                        display: 'grid', 
                                                        gridTemplateColumns: '1fr auto',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                    }}>
                                                    <span>{post.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={post.type === PostType.TASK ? isInTaskList : isInTeamTaskList}
                                                        onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleAddPostToList(post.id, post.type);
                                                        } else {
                                                            handleRemovePostFromList(post.id, post.type);
                                                        }
                                                        }}
                                                    />
                                                    <hr></hr>
                                                    </div>
                                                    
                                                );
                                                })}
                                            </div>
                                        </>
                                        )}
                        <div>
                            <label htmlFor="post-deadline" >Срок </label>
                            <input id="post-deadline" type='datetime-local' value={postDeadline}  onChange={handlePostDeadlineChange}/>
                        </div>
                        {postDeadline != "" && (
                            <>
                            <div>
                                <label>Штраф раз в *</label>
                                    <select 
                                        value={unit} 
                                        onChange={(e) => setUnit(e.target.value as UnitType)}
                                    >
                                        <option value={UnitType.MINUTE}>Минуты</option>
                                        <option value={UnitType.HOUR}>Часы</option>
                                        <option value={UnitType.DAY}>Дни</option>
                                    </select>
                            </div>

                            <div >
                                <label>Шаг *</label>
                                <input 
                                    type="number" 
                                    value={step} 
                                    onChange={(e) => setStep(Number(e.target.value))}
                                    min="1"
                                />
                            </div>

                            <div>
                                <label>Значение штрафа *</label>
                                <input 
                                    type="number" 
                                    value={value} 
                                    onChange={(e) => setValue(Number(e.target.value))}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            </>
                        )}

                        {postType === PostType.TASK && (
                        <div style={{borderTop: "1px solid #ccc", paddingTop: "10px", marginTop: "5px"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <label style={{fontWeight: "bold", margin: 0}}>P2P оценивание</label>
                                <input
                                    type="checkbox"
                                    checked={isP2pEnabled}
                                    onChange={(e) => setIsP2pEnabled(e.target.checked)}
                                />
                            </div>

                            {isP2pEnabled && (
                                <>
                                    <div>
                                        <label>Способ распределения*</label>
                                        <select value={p2pType} onChange={(e) => setP2pType(e.target.value)}>
                                            <option value="RANDOM">Случайный</option>
                                            <option value="MANUAL">Ручной</option>
                                            <option value="HIMSELF">Самостоятельный выбор</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Анонимность*</label>
                                        <select value={p2pVisibility} onChange={(e) => setP2pVisibility(e.target.value)}>
                                            <option value="NONE">Полная анонимность</option>
                                            <option value="PART">Частичная (видна работа, не автор)</option>
                                            <option value="ALL">Открытая</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Дедлайн проверки</label>
                                        <input
                                            type='datetime-local'
                                            value={p2pDeadline}
                                            onChange={(e) => setP2pDeadline(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        )}

                        <div>                    
                            <input type="file" multiple={false} onChange={handleFileChange}  />
                            
                        </div>
        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={CreatePost} >
                                Создать 
                            </button>
                            
                            <button className={styles.button} type="button" onClick={() => setOpen(false)} >
                                Отмена
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default CreatePostDialog;