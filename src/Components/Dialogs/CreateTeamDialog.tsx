import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { DeletePostsThunk,  GetPostByIdThunk } from "../../reducers/posts-reducer";
import { ErrorResponse, PostType, Task, Team } from "../../types";
import axios from "axios";
const CreateTeamDialog: React.FC<{ taskId: string}> = ({ taskId}) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [teamName, setTeamName] = useState<string>('');
    const [teamDeadline, setTeamDeadline] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const dispatch: any = useDispatch()

    const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value); 
    };
    
    const handleTeamDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamDeadline(event.target.value); 
    };


    const CreateTeam = async () =>{
        const data = await api.CreateTeam(teamName,taskId, teamDeadline )
        if(axios.isAxiosError<ErrorResponse>(data))
        {
            setErrorText(data.response?.data.message ||"")
        }
        dispatch(GetPostByIdThunk(taskId, PostType.TEAM_TASK))
        setOpen(false)
    }
   
    



    return(
        <>
            <button  className="roundBtn" onClick={() => setOpen(true)}>
                +
            </button>

{isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Создать команду</p>
                        
                        <div>
                            <label htmlFor="team-name" >Название*</label>
                            <input id="team-name" value={teamName}  onChange={handleTeamNameChange}/>
                        </div>
                                                
                        <div>
                            <label htmlFor="post-deadline" >Срок </label>
                            <input id="post-deadline" type='datetime-local' value={teamDeadline}  onChange={handleTeamDeadlineChange}/>
                        </div>


        
                        <b className={styles['error']} >{errorText}</b>
                        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={CreateTeam} >
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

export default CreateTeamDialog;