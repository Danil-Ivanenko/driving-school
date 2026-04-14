import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetCommentsByPostIdThunk, GetPostByIdThunk, GetSolutionsByPostIdThunk } from "../../reducers/posts-reducer";
import { PostType, Team } from "../../types";
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from "../../RoleChecker";
import DeletePostDialog from "./DeletePostDialog";
import DeleteTeamDilaog from "./DeleteTeamDilaog";
import StudentParticipantInfo from "./StudentParticipantInfo";
import AddMembersToTeamDialog from "./AddMembersToTeamDialog";
import InviteStudentToTeamDialog from "./InviteStudentToTeamDialog";
const TeamInfo: React.FC<{ team: Team}> = ({ team}) => {
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const [isOpen, setOpen] = useState<boolean>(false);

    const dispatch: any = useDispatch()
    const DeleteUserForomTeam = async (userId: number) =>{
         await api.DeleteUserFromTeam(team.id, userId )

        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
        setOpen(false)
    }

    const ChangeTeam = async (userId: number) =>{
         await api.DeleteUserFromTeam(team.id, userId )

        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
        setOpen(false)
    }
    return(
        <>
            <div  style={{marginTop : "10px"}}   > 
                
                <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <div className='headline'  style={{ cursor: hasAnyRole([MANAGER, TEACHER]) ? 'pointer' : 'default' }}  > {team.name}   {hasAnyRole([MANAGER,TEACHER]) &&<AddMembersToTeamDialog team={team} /> } </div>
                        
                        <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                            {hasAnyRole([MANAGER,TEACHER]) && <DeleteTeamDilaog team={team}/> }
                            
                           
                            {hasAnyRole([STUDENT]) && <StudentParticipantInfo team={team}/> }
                            
                        </div>
                </div>
                
                { team.users.map((user) => (
                    <>
                        {hasAnyRole([MANAGER,TEACHER]) &&  <p className='userP' key={user.id} style={{ cursor: 'pointer' }} onClick={() => DeleteUserForomTeam(user.id)}> {team.captainId == user.id ? "Капитан:" : ""} {user.surname} {user.name} ❌ </p> }
                        {hasAnyRole([STUDENT]) &&  <p className='userP' key={user.id} > {team.captainId == user.id ? "Капитан:" : ""} {user.surname} {user.name}  </p> }
                        
                    </>
                    
                   
                ))}

            </div>

           
            
        </>
        
    );
}

export default TeamInfo;