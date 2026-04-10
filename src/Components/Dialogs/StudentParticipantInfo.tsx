import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { ChannelUser, PostType, Task, Team } from "../../types";
import { GetPostByIdThunk } from "../../reducers/posts-reducer";
const StudentParticipantInfo:  React.FC<{ team: Team}> = ({ team}) => {

    const dispatch: any = useDispatch()

    const postState = useTypedSelector(state => state.posts.selectedPost!) as Task; 
    const userId = localStorage.getItem('id');
    const JoinToTeam = async () =>{
            
        await api.StudentJoinToTeam(team.id)
        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
    }

    const LeaveFromTeam = async () =>{
            
        await api.StudentLeaveFromTeam(team.id)
        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
    }
    
   const isUserInAnyTeam = () => {

        
        return postState.teams.some((team: Team) => 
            team.users.some((member: ChannelUser) => member.id.toString() == userId)
        );
    };

  
    const isUserInCurrentTeam = () => {
        if (team?.users == null) return false;
        return team.users.some((member: any) => member.id == userId);
    };


    return(
       <>
        {postState.isCanRedistribute  &&(
            isUserInCurrentTeam() ? (
                <button className="roundBtn" onClick={LeaveFromTeam} >
                    -
                </button>
            ) : (
                !isUserInAnyTeam() && (
                    <button className="roundBtn" onClick={JoinToTeam} >
                        +
                    </button>
                )
            )
        )}
        </>
        
    );
}

export default StudentParticipantInfo;