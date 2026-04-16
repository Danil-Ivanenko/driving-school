import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetPostByIdThunk } from "../../reducers/posts-reducer";
import { ChannelUser, PostType, Team } from "../../types";
const DelelteOrMakeCapitanDialog: React.FC<{ team: Team, user : ChannelUser}> = ({ team, user}) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const dispatch: any = useDispatch()
    const selectedChannel = useTypedSelector(state => state.channels.selectedChannel); 
    
    const DeleteUserFromTeam = async () =>{
         await api.DeleteUserFromTeam(team.id, user.id )

        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
        setOpen(false)
    }

    const MakeUserCapitan = async () =>{
         await api.MakeUserCapitan(team.id, user.id )

        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
        setOpen(false)
    }



    return(
        <>
            <div className='headline' style={{cursor : "pointer"}} onClick={() => setOpen(true)}>  ✎</div>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Изменить пользователя {user.surname} {user.name}</p>
                        
        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            {team.captainId != user.id &&  (
                                <button className={styles.button} type="button" onClick={MakeUserCapitan} >
                                    Назначить капитаном 
                                </button>

                            )}

                            <button className={styles.button} type="button" onClick={DeleteUserFromTeam} >
                                Удалить 
                            </button>
                            
                            <button className={styles.button} type="button"  onClick={() => setOpen(false)} >
                                Отмена
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default DelelteOrMakeCapitanDialog;