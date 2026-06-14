import React, { useEffect, useState } from 'react';

import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import {  Post, PostType, PostTypeTranslations, UnitTypeTranslations } from '../types';

import DeletePostDialog from './Dialogs/DeletePostDialog';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../RoleChecker';
import CreatePostDialog from './Dialogs/CreatePostDialog';
import SendTaskDialog from './Dialogs/SendTaskDialog';
import { GetCommentsByPostIdThunk, GetPostByIdThunk, GetSolutionsByPostIdThunk } from '../reducers/posts-reducer';
import OrderSolutionDialog from './Dialogs/OrderSolutionDialog';
import PostComment from './Dialogs/PostComment';
import MetricsDialog from './Dialogs/MetricsDialog';
import P2PManagerPersonal from './Dialogs/P2PManagerPersonal';
import { ChannelUser } from '../types';


const PostInfo: React.FC = () => {
    const [commentText, setCommentText] = useState<string>('');
    const postState = useTypedSelector(state => state.posts.selectedPost!) as Post; 

    const dispatch: any = useDispatch()
    const solutions = useTypedSelector(state => state.posts.solutions)
    const comments = useTypedSelector(state => state.posts.comments)

    const selectedChannel = useTypedSelector(state => state.channels.selectedChannel);
    const [showP2PManager, setShowP2PManager] = useState(false);
    const [channelUsers, setChannelUsers] = useState<ChannelUser[]>([]);
    useEffect(() => {
        dispatch(GetChannelsThunk())
        dispatch(GetSolutionsByPostIdThunk(postState.id))
        dispatch(GetCommentsByPostIdThunk(postState.id))
    }, [])

    useEffect(() => {
        const loadChannelUsers = async () => {
            if (postState.isP2pEnabled && selectedChannel?.id) {
                const users = await api.GetChannelUsers(selectedChannel.id);
                setChannelUsers(users || []);
            }
        };
        loadChannelUsers();
    }, [postState.id]);
    
    const handleCommentTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommentText(event.target.value); 
    };
    const SendNewComment = async () =>{
        if(commentText.length > 0)
        {
            await api.SendComment(postState.id, commentText)
            setCommentText("")
            dispatch(GetCommentsByPostIdThunk(postState.id))
        }

    }

    const ChangeMetricsVisibility = async () =>{

            await api.changePostVisibility(postState.id, !postState.isMetricsVisibleToStudents)
            dispatch(GetPostByIdThunk(postState.id,postState.type ))
    }


    return (
        
        <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

    
            
                <div className='simpleForm' style={{ justifyContent :"space-between"}} >
                    <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <p className='headline'>{PostTypeTranslations[postState.type]}: {postState.label} </p>
                        <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                            {hasAnyRole([STUDENT]) && (postState.type == PostType.TASK || postState.type == PostType.CONTROL) &&  < SendTaskDialog/> }
                            {hasAnyRole([MANAGER,TEACHER]) && ( <> 
                                {(postState.type == PostType.TASK || postState.type == PostType.CONTROL) && ( <MetricsDialog id={postState.id} postType={postState.type}/> )}
                                <DeletePostDialog/>  
                            </>) }
                        </div>
                    </div>
                    
                    {postState.fileName != null && postState.fileUrl != null &&
                     (<p className='headline' onClick={() => window.location.href = postState.fileUrl!} style={{cursor : "pointer"}}> Файл: {postState.fileName} </p>)
                    }

                    
                    {postState.deadline != null && postState.deadlinePenalty != null && (
                        <>
                        <p className='baseP'>Сдать до {postState.deadline}</p>
                        <p className='baseP'>Наказание за deadline: за  {postState.deadlinePenalty.step} {UnitTypeTranslations[postState.deadlinePenalty.unit]}  - {postState.deadlinePenalty.value} балл</p>
                        </>
                    )}
                    
                    {hasAnyRole([MANAGER,TEACHER]) && ( <> 
                             <p className='baseP' onClick={ChangeMetricsVisibility} >Видимость : {String(postState.isMetricsVisibleToStudents)}</p>
                    </>) }
                    {postState.type == PostType.CONTROL && ( <> 
                        <p className='baseP'  > Задания:</p>
                        {postState.control.postTaskIds.map((postTask) => (
                            <p className='baseP' key={postTask.id}>  {postTask.label}</p>
                        ))}
                        
                        {postState.control.taskIds.map((postTask) => (
                            <p className='baseP' key={postTask.id}>  {postTask.label}</p>
                        ))}
                    </>) }

                    <hr/>
                    <p> {postState.text}</p>

                    {postState.type === PostType.TASK && (
                        <div style={{borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "4px"}}>
                            <p className='baseP' style={{fontWeight: "bold"}}>
                                P2P оценивание: {postState.isP2pEnabled ? 'включено' : 'выключено'}
                            </p>
                            {postState.isP2pEnabled && postState.p2pParam && (
                                <>
                                    <p className='baseP'>Способ распределения: {
                                        postState.p2pParam.type === 'RANDOM' ? 'Случайный' :
                                        postState.p2pParam.type === 'MANUAL' ? 'Ручной' :
                                        'Самостоятельный выбор'
                                    }</p>
                                    <p className='baseP'>Анонимность: {
                                        postState.p2pParam.visibility === 'ALL' ? 'Открытая' :
                                        postState.p2pParam.visibility === 'PART' ? 'Частичная' :
                                        'Полная анонимность'
                                    }</p>
                                    {postState.p2pParam.p2pDeadline && (
                                        <p className='baseP'>Дедлайн проверки: {new Date(postState.p2pParam.p2pDeadline).toLocaleString()}</p>
                                    )}
                                </>
                            )}
                        </div>
                        
                    )}

                    {hasAnyRole([MANAGER, TEACHER]) && postState.type === PostType.TASK && postState.isP2pEnabled && (
                        <button className={styles.button} style={{width: 'fit-content', marginTop: "10px",}} onClick={() => setShowP2PManager(true)}>
                            P2P управление
                        </button>
                    )}

                </div>
                
                <div className='simpleForm'>  
                        <div style={{display : "flex", justifyContent: "space-between"}}>
                            <p className='headline'>  Комментарии: {comments.length } </p>
                        </div>
                        
                        <div >
                            <label htmlFor="comment-name" >Оставить комменатрий</label>
                            <input id="comment-name" value={commentText} onChange={handleCommentTextChange}  />
                            <button className={styles.button} style={{marginTop : "5px"}} onClick={SendNewComment} >Отправить</button>
                        </div>

                        { 
                            
                            comments.map((comment) => (
                                <PostComment comment={comment} key={comment.id} />
                            ))

                        }

                </div>

                



                
                {(postState.type == PostType.TASK || postState.type == PostType.CONTROL) &&  hasAnyRole([MANAGER,TEACHER])  &&(

                    <div className='simpleForm'>  
                        <div style={{display : "flex", justifyContent: "space-between"}}>
                            <p className='headline'> Решения </p>
                        </div>

                        {solutions.map((sol) => (

                            <div key={sol.id} style={{marginTop : "10px"}}   >
                                 <p className='baseP'> <b> Пользователь:</b>  {sol.studentName}</p>
                                 <p className='baseP'> <b> Текст:</b>  {sol.text}</p>
                                 {sol.fileUrl !== null && ( <p className='baseP' style={{cursor : "pointer"}} onClick={() => window.location.href = sol.fileUrl!} > <b> Файл:</b>   {sol.fileName}</p> )}
                                
                                < OrderSolutionDialog   userId={sol.studentId}/>
                                <hr className="hr" />
                            </div>
                            
                        ))}
                    </div>

                )}

                {showP2PManager && (
                    <div className="modal-overlay">
                        <div className="modal-content large">
                            <P2PManagerPersonal
                                postId={postState.id}
                                channelUsers={channelUsers}
                                onClose={() => setShowP2PManager(false)}
                            />
                        </div>
                    </div>
                )}


                
           
    
        </div>

    );
};

export default PostInfo