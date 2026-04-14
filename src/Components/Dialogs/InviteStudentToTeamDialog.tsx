import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { ChannelUser, PostType, Team } from "../../types";
import { GetPostByIdThunk } from "../../reducers/posts-reducer";
const InviteStudentToTeamDialog: React.FC<{ team: Team}> = ({ team}) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [freeStudents, setFreeStudents] = useState<ChannelUser[]>([]);
    const dispatch: any = useDispatch()


    const GetFreeStudents = async () =>{
        const data = await api.GetStudentsToInvie(team.id)
        setFreeStudents(data)
    }
    const OpenDialog = async () =>{
        setOpen(true)
        await GetFreeStudents()
    }

    const InviteUserToTeam = async (userId : number) =>{
        await api.InviteUserToTeam(team.id, userId)
        await GetFreeStudents()
        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
    }

    return(
        <>
              
            <div  style={{display : "inline-flex"}} className='course-block' onClick={OpenDialog}> Пригласить</div>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        
                        {freeStudents.length > 0 ? 
                            (<div style={{ maxHeight: "300px", overflowY: "auto",}}>

                                {freeStudents.map((student) => 
                                    <p key={student.id}  className="studentItem" onClick={() => InviteUserToTeam(student.id)}> {student.surname}  {student.name}</p>
                                )}
                            </div>)
                            : ( <p>Нет доступных пользователей</p>)
                        }
                        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >

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

export default InviteStudentToTeamDialog;