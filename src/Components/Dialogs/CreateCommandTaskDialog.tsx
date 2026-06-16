import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { ChangeEvent, use, useEffect, useRef, useState } from "react";

import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { CommandSolutionType, CommandTeamType, ErrorResponse, PostType, UnitType } from "../../types";
import { GetPostsThunk } from "../../reducers/posts-reducer";
import axios from "axios";

const CreateCommandTaskDialog: React.FC<{channelId : string}> = ({channelId})  => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [postName, setPostName] = useState<string>('');
    const [postText, setPostText] = useState<string>('');
    const [commandCount, setCommandCount] = useState<number | string>('');
    const [postCommandTeamType, setPostCommandTeamType] = useState<CommandTeamType>(CommandTeamType.FREE);
    const [postDeadline, setPostDeadline] = useState<string>('');
    const [file, setFile] = useState<File| null>(null);
    const [postCommandSolutionType, setCommandSolutionType] = useState<CommandSolutionType>(CommandSolutionType.FIRST);
    const [qualifiedMin, setqualifiedMin] = useState<number | string>('');
    const [minTeamSize, sertMinTeamSize] = useState<number | string>('');

    const [isCanRedistribute, setIsCanRedistribute ] = useState<boolean>(true);
    const [errorText, setErrorText] = useState<string>('');

    const [unit, setUnit] = useState<UnitType>(UnitType.DAY);
    const [step, setStep] = useState<number>( 1);
    const [value, setValue] = useState<number>(1);

    const [isP2pEnabled, setIsP2pEnabled] = useState<boolean>(false);
    const [p2pType, setP2pType] = useState<string>('RANDOM');
    const [p2pVisibility, setP2pVisibility] = useState<string>('ALL');
    const [p2pDeadline, setP2pDeadline] = useState<string>('');
        
    const handleMinTeamSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        sertMinTeamSize(value === '' ? '' : Number(value));
    };
    
    const handleIsCanRedistribute = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setIsCanRedistribute(event.target.value === 'true');
    };

    const handleQualifiedMin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setqualifiedMin(value === '' ? '' : Number(value));
    };

    const handleCommandCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCommandCount(value === '' ? '' : Number(value));
    };

    const handleCommandSolutionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as CommandSolutionType;
        setCommandSolutionType(value);
    };
    
    const handlePostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostName(event.target.value); 
    };
    
    const handlePostTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostText(event.target.value); 
    };

    const handlePostCommandTeamType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as CommandTeamType;
        setPostCommandTeamType(value);
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

    const p2pParam = isP2pEnabled ? {
        type: p2pType,
        visibility: p2pVisibility,
        p2pDeadline: p2pDeadline !== '' ? `${p2pDeadline}:00.000Z` : undefined
    } : undefined;

    const CreateCommandTask = async () =>{
        // const data = await api.CreateCommandTask(channelId, postName, postText, postCommandTeamType,
        //         Number(commandCount), postCommandSolutionType, Number(minTeamSize),
        //       isCanRedistribute, postDeadline, 
        //       typeof qualifiedMin === 'string' ? null : Number(qualifiedMin) , 
        //       file , {unit : unit, step : step, value : value})
        const data = await api.CreateCommandTask(channelId, postName, postText, postCommandTeamType,
            Number(commandCount), postCommandSolutionType, Number(minTeamSize),
            isCanRedistribute, postDeadline,
            typeof qualifiedMin === 'string' ? null : Number(qualifiedMin),
            file, {unit, step, value},
            isP2pEnabled, p2pParam)

        if(axios.isAxiosError<ErrorResponse>(data))
        {

            console.log()
            setErrorText(data.response?.data.message ||"")
        }
        else
        {

        
            setOpen(false)
            setPostName('')
            setPostText('')
            setCommandCount('');
            setPostCommandTeamType(CommandTeamType.FREE)
            setPostDeadline('')
            setFile(null);
            setCommandSolutionType(CommandSolutionType.FIRST)
            setqualifiedMin('')
            sertMinTeamSize('')
            setIsCanRedistribute(true)
            setErrorText('')
            setValue(1);
            setUnit(UnitType.DAY);
            setStep(1)
            setIsP2pEnabled(false);
            setP2pType('RANDOM');
            setP2pVisibility('ALL');
            setP2pDeadline('');
            dispatch(GetPostsThunk(selectedChannel!.id))
        }
    }

    return(
        <>
       
             <div className='course-block' onClick={() => setOpen(true)} style={{width : "90%"}}> Создать командное задание</div>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px",}} >Создать командное задание</p>
                        
                        <div>
                            <label htmlFor="post-name" >Название*</label>
                            <input id="post-name" value={postName}  onChange={handlePostNameChange}/>
                        </div>
                                                
                        <div>
                            <label htmlFor="post-text" >Текст*</label>
                            <textarea id="post-text" style={{maxWidth: "100%", minWidth: "100%", maxHeight : "300px"}} value={postText}  onChange={handlePostTextChange}/>
                        </div>
                        
                        <div>
                            <label htmlFor="post-type" >Тип команд*</label>
                            <select value={postCommandTeamType} onChange={handlePostCommandTeamType}>
                                <option value={CommandTeamType.RANDOM}>Случайно</option>
                                <option value={CommandTeamType.DRAFT}>Драфт</option>
                                <option value={CommandTeamType.FREE}>Свободно</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="post-command-count" >Кол-во команд*</label>
                             <input id="post-command-count" value={commandCount}  type="number"  onChange={handleCommandCountChange}/>
                        </div>
                        <div >
                            <label >Минимальное кол-во членов команды*</label>
                             <input  value={minTeamSize}  type="number"  onChange={handleMinTeamSize}/>
                        </div>
                        <div>
                            <label  >Тип сдачи*</label>
                            <select value={postCommandSolutionType} onChange={handleCommandSolutionTypeChange}>
                                <option value={CommandSolutionType.LAST}>Последний</option>
                                <option value={CommandSolutionType.FIRST}>Первый</option>
                                <option value={CommandSolutionType.CAPITAN}>Капитан</option>
                                <option value={CommandSolutionType.DEMOCRATIC}>Выбор</option>
                                <option value={CommandSolutionType.QUALIFIED}>Квалификация</option>
                            </select>
                        </div>
                        
                        {postCommandSolutionType == CommandSolutionType.QUALIFIED && (
                            <div >
                                <label >Кол-во квалификации*</label>
                                <input  value={qualifiedMin}  type="number"  onChange={handleQualifiedMin}/>
                            </div>

                            
                        )}


                        <div >
                            <label >Перегруппировка*</label>
                            <select value={String(isCanRedistribute)} onChange={handleIsCanRedistribute}>
                                <option value={'true'}>Да</option>
                                <option value={'false'}>Нет</option>
                            </select>
                        </div>
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


                        <div>                    
                            <input type="file" multiple={false} onChange={handleFileChange}  />
                            
                        </div>
                        <b className={styles['error']} >{errorText}</b>
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={CreateCommandTask} >
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

export default CreateCommandTaskDialog;