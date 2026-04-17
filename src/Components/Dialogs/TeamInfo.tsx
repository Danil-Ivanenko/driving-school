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
import TeamMarkDialog from "./TeamMarkDialog";
import StudentMarkDialog from "./StudentMarkDialog";
import DelelteOrMakeCapitanDialog from "./DelelteOrMakeCapitanDialog";
import ReallocationOfMarksDialog from "./ReallocationOfMarksDialog";
const TeamInfo: React.FC<{ team: Team}> = ({ team}) => {
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const [isOpen, setOpen] = useState<boolean>(false);

    const [teamMark, setTeamMark] = useState<number | null>(null);
    const [userMarks, setUserMarks] = useState<Map<number, number>>(new Map());
    const [loadingMarks, setLoadingMarks] = useState(false);

    const currentUser = useTypedSelector(state => state.myProfile.profile);
    const isCurrentUserInThisTeam = () => {
        if (!hasAnyRole([STUDENT])) return false;
        return team.users.some(user => user.id === currentUser?.id);
    };

    useEffect(() => {
        const loadMarks = async () => {
            setLoadingMarks(true);
            try {
                const mark = await api.getTeamMark(team.id);
                setTeamMark(mark);

                const marksMap = new Map<number, number>();

                if (hasAnyRole([STUDENT])) {
                    if (isCurrentUserInThisTeam()) {
                        for (const user of team.users) {
                            const userMark = await api.getUserMark(user.id, team.taskId);
                            if (userMark !== null) {
                                marksMap.set(user.id, userMark.mark);
                            }
                        }
                    }
                } else {
                    for (const user of team.users) {
                        const userMark = await api.getUserMark(user.id, team.taskId);
                        if (userMark !== null) {
                            marksMap.set(user.id, userMark.mark);
                        }
                    }
                }
                setUserMarks(marksMap);
            } catch (err) {
                console.error('Failed to load marks:', err);
            } finally {
                setLoadingMarks(false);
            }
        };
        
        loadMarks();
    }, [team.id, team.taskId, team.users]);


    // useEffect(() => {
    //     const loadMarks = async () => {
    //         setLoadingMarks(true);
    //         try {
    //             const mark = await api.getTeamMark(team.id);
    //             setTeamMark(mark);
                
    //             const marksMap = new Map<number, number>();
    //             for (const user of team.users) {
    //                 const userMark = await api.getUserMark(user.id, team.taskId);
    //                 if (userMark !== null) {
    //                     marksMap.set(user.id, userMark.mark);
    //                 }
    //             }
    //             setUserMarks(marksMap);
    //         } catch (err) {
    //             console.error('Failed to load marks:', err);
    //         } finally {
    //             setLoadingMarks(false);
    //         }
    //     };
        
    //     loadMarks();
    // }, [team.id, team.taskId, team.users]);

    const [showTeamMarkDialog, setShowTeamMarkDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string; surname: string } | null>(null);

    const dispatch: any = useDispatch()

    const ChangeTeam = async (userId: number) =>{
         await api.DeleteUserFromTeam(team.id, userId )

        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
        setOpen(false)
    }
    const refreshData = () => {
        dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK));
    };
    return(
        <>
            <div  style={{marginTop : "10px"}}   > 
                
                <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <div className='headline'  style={{ cursor: hasAnyRole([MANAGER, TEACHER]) ? 'pointer' : 'default' }}  > {team.name}   {hasAnyRole([MANAGER,TEACHER]) &&<AddMembersToTeamDialog team={team} /> } </div>
                        
                        <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                            {hasAnyRole([MANAGER, TEACHER]) &&  team.users.length > 0 && (
                                <button className='course-block' onClick={() => setShowTeamMarkDialog(true)} >
                                    {team.mark ? `Оценка команды: ${team.mark}` : 'Поставить оценку команде'}
                                </button>
                            )}
                
                            
                            {hasAnyRole([MANAGER,TEACHER]) && <DeleteTeamDilaog team={team}/> }
                            
                           
                            {hasAnyRole([STUDENT]) && <StudentParticipantInfo team={team}/> }
                            
                        </div>
                </div>


                { team.users.map((user) => (
                    <div style={{display : "flex" , marginTop: "15px"}}>
                        {hasAnyRole([MANAGER,TEACHER]) &&  <p className='userP' key={user.id} style={{ cursor: 'pointer' }} > {team.captainId == user.id ? "Капитан:" : ""} {user.surname} {user.name} </p> }

                        {hasAnyRole([MANAGER,TEACHER]) &&  <DelelteOrMakeCapitanDialog team={team} user={user}/> }
                        {hasAnyRole([STUDENT]) &&  <p className='userP' key={user.id} > {team.captainId == user.id ? "Капитан:" : ""} {user.surname} {user.name}  </p> }
                        
                        {hasAnyRole([MANAGER, TEACHER]) && (
                            <button 
                                className={styles.button}
                                style={{ marginLeft: '10px', fontSize: '12px' }}
                                onClick={() => setSelectedStudent({ id: user.id, name: user.name, surname: user.surname })}
                            >
                                Оценить
                            </button>
                        )}
                    </div>
                    
                   
                ))}
                  
                {!loadingMarks && teamMark !== null && (

                    <p className='baseP' style={{ marginTop: '10px', color: '#10b981' }}>
                        Оценка команды: {teamMark}
                    </p>
                    
                )}
                 {hasAnyRole([STUDENT]) && team.mark != null &&<ReallocationOfMarksDialog team={team}/> }
                {!loadingMarks && userMarks.size > 0 && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                        <p className='baseP' style={{ fontWeight: 'bold' }}>Персональные оценки:</p>
                        {team.users.map((user) => {
                            const mark = userMarks.get(user.id);
                            return mark !== undefined && (
                                <p key={user.id} className='baseP' style={{ marginLeft: '15px' }}>
                                    {user.surname} {user.name}: {mark}
                                </p>
                            );
                        })}
                    </div>
                )}

            </div>

            {showTeamMarkDialog && (
                <TeamMarkDialog
                    teamId={team.id}
                    teamName={team.name}
                    onClose={() => setShowTeamMarkDialog(false)}
                    onSuccess={refreshData}
                />
            )}

            {selectedStudent && (
                <StudentMarkDialog
                    userId={selectedStudent.id}
                    userName={`${selectedStudent.surname} ${selectedStudent.name}`}
                    taskId={team.taskId}
                    onClose={() => setSelectedStudent(null)}
                    onSuccess={refreshData}
                />
            )}
            
        </>
        
    );
}

export default TeamInfo;