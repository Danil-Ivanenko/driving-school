import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { ChangeEvent, use, useEffect, useRef, useState } from "react";

import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { CommandSolutionType, CommandTeamType, ErrorResponse, PostType } from "../../types";
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

    const CreateCommandTask = async () =>{
        const data = await api.CreateCommandTask(channelId, postName, postText, postCommandTeamType,
                Number(commandCount), postCommandSolutionType, Number(minTeamSize),
              isCanRedistribute, postDeadline, 
              typeof qualifiedMin === 'string' ? null : Number(qualifiedMin) , 
              file )

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

            dispatch(GetPostsThunk(selectedChannel!.id))
        }
    }

    return(
        <>
       
             <div className='course-block' onClick={() => setOpen(true)} style={{width : "90%"}}> Создать командное задание</div>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Создать командное задание</p>
                        
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