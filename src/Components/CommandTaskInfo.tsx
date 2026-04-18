import React, { useEffect, useState } from 'react';

import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import {  Post, PostType, PostTypeTranslations, Task } from '../types';

import DeletePostDialog from './Dialogs/DeletePostDialog';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../RoleChecker';
import CreatePostDialog from './Dialogs/CreatePostDialog';
import SendTaskDialog from './Dialogs/SendTaskDialog';
import { GetCommentsByPostIdThunk, GetPostByIdThunk, GetSolutionsByPostIdThunk } from '../reducers/posts-reducer';
import OrderSolutionDialog from './Dialogs/OrderSolutionDialog';
import PostComment from './Dialogs/PostComment';
import TeamInfo from './Dialogs/TeamInfo';
import CreateTeamDialog from './Dialogs/CreateTeamDialog';
import TaskSolutionManager from './Dialogs/TaskSolutionManager'; 


const CommandTaskInfo: React.FC = () => {
    const postState = useTypedSelector(state => state.posts.selectedPost!) as Task; 
    const dispatch: any = useDispatch();

    const [showTaskSolutionManager, setShowTaskSolutionManager] = useState(false);
    const [mySolutionExists, setMySolutionExists] = useState(false);
    const [solutionsCount, setSolutionsCount] = useState(0);

    const [isInTeam, setIsInTeam] = useState<boolean>(false);
    const [loadingTeamCheck, setLoadingTeamCheck] = useState(true);

    useEffect(() => {
        if (hasAnyRole([STUDENT])) {
            checkStudentTeam();
        }
    }, [postState.id]);

    const checkStudentTeam = async () => {
        setLoadingTeamCheck(true);
        try {
            const studentTeam = await api.getMyTeamByTask(postState.id);
            setIsInTeam(!!studentTeam);
        } catch (err) {
            setIsInTeam(false);
        } finally {
            setLoadingTeamCheck(false);
        }
    };

    useEffect(() => {
        const updateTeamStatus = async () => {
            if (hasAnyRole([STUDENT])) {
                setLoadingTeamCheck(true);
                try {
                    const myTeam = await api.getMyTeamByTask(postState.id);
                    setIsInTeam(!!myTeam);
                } catch (err) {
                    setIsInTeam(false);
                } finally {
                    setLoadingTeamCheck(false);
                }
            }
        };
        
        updateTeamStatus();
    }, [postState]); 

    useEffect(() => {
        const checkSolutions = async () => {
            if (hasAnyRole([STUDENT])) {
                try {
                    const mySolutions = await api.getMyTaskSolutions();
                    const hasSolution = mySolutions.some(s => s.taskId === postState.id);
                    setMySolutionExists(hasSolution);
                } catch (err) {
                    console.error('Failed to check my solution:', err);
                }
            }
            
            if (hasAnyRole([MANAGER, TEACHER])) {
                try {
                    const allSolutions = await api.getTaskSolutionsByTask(postState.id);
                    setSolutionsCount(allSolutions.length);
                } catch (err) {
                    console.error('Failed to get solutions count:', err);
                }
            }
        };
        
        checkSolutions();
    }, [postState.id]);

    const refreshData = async () => {
        if (hasAnyRole([STUDENT])) {
            try {
                const mySolutions = await api.getMyTaskSolutions();
                const hasSolution = mySolutions.some(s => s.taskId === postState.id);
                setMySolutionExists(hasSolution);
            } catch (err) {
                console.error('Failed to refresh my solution:', err);
            }
        }
        
        if (hasAnyRole([MANAGER, TEACHER])) {
            try {
                const allSolutions = await api.getTaskSolutionsByTask(postState.id);
                setSolutionsCount(allSolutions.length);
            } catch (err) {
                console.error('Failed to refresh solutions count:', err);
            }
        }
        
        dispatch(GetChannelsThunk());
    };


    const changeTaskRedistribute = async () => {
        if (hasAnyRole([MANAGER, TEACHER])) {

            await api.ChangeCommandTaskRedistribute(postState.id, !postState.isCanRedistribute);
            dispatch(GetPostByIdThunk(postState.id ,PostType.TEAM_TASK ))
        }
        };
    return (
        
        <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

    
            
                <div className='simpleForm' style={{ justifyContent :"space-between"}} >
                    <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <p className='headline'>Командное задание: {postState.label} </p>
                        
                        <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                            {hasAnyRole([MANAGER,TEACHER]) && <DeletePostDialog/> }
                        </div>
                    </div>
                    
                    {postState?.documents[0]?.fileName != null && postState?.documents[0]?.fileUrl != null &&
                     (<p className='headline' onClick={() => window.location.href = postState.documents[0].fileName} style={{cursor : "pointer"}}> Файл: {postState.documents[0].fileUrl} </p>)
                    }

                    
                    {postState.votingDeadline != null && (
                        <p className='baseP'>Сдать до {postState.votingDeadline}</p>
                    )}


                    <p> {postState.text}</p>
                    <p className='baseP'>Тип команд: {postState.teamType}</p>
                    <p className='baseP'>Тип сдачи: {postState.type}</p>
                    <p className='baseP' onClick={changeTaskRedistribute}>Перегруппировка: {postState.isCanRedistribute ? "+" : "-"}</p>
                    <p className='baseP'>Минимальное кол-во членов команды: {postState.minTeamSize}</p>
                    {postState.qualifiedMin != null && (
                        <p className='baseP'>Кол-во квалификации: {postState.qualifiedMin}</p>
                    )}
                    <br></br>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {/* {hasAnyRole([STUDENT]) && (
                            <button 
                                className={styles.button}
                                onClick={() => setShowTaskSolutionManager(true)}
                            >
                                {mySolutionExists ? 'Редактировать решение' : 'Отправить решение'}
                            </button>
                        )} */}
                        {hasAnyRole([STUDENT]) && !loadingTeamCheck && isInTeam && (
                            <button 
                                className={styles.button}
                                onClick={() => setShowTaskSolutionManager(true)}
                            >
                                {mySolutionExists ? 'Редактировать решение' : 'Отправить решение'}
                            </button>
                        )}


                        {hasAnyRole([STUDENT]) && !loadingTeamCheck && !isInTeam && (
                            <div style={{ 
                                padding: '8px 12px', 
                                background: '#fee2e2', 
                                color: '#dc2626', 
                                borderRadius: '6px',
                                fontSize: '0.85rem'
                            }}>
                                Вы не состоите в команде.
                            </div>
                        )}
                        
                        {hasAnyRole([MANAGER, TEACHER]) && (
                            <button 
                                className={styles.button}
                                onClick={() => setShowTaskSolutionManager(true)}
                            >
                                Все решения ({solutionsCount})
                            </button>
                        )}
                    </div>
                    
                    {hasAnyRole([MANAGER,TEACHER]) && <p className='headline'>Создать команду:  < CreateTeamDialog taskId={postState.id} /></p> }
                    
                </div>
                
                {showTaskSolutionManager && (
                    <div className="modal-overlay">
                        <div className="modal-content large">
                            <TaskSolutionManager
                                taskId={postState.id}
                                taskType={postState.type}
                                isTeacher={hasAnyRole([MANAGER, TEACHER])}
                                teams={postState.teams}
                                onClose={() => {
                                    setShowTaskSolutionManager(false);
                                    refreshData();
                                }}
                            />
                        </div>
                    </div>
                )}
                
                {postState.teams.map((team) => (
                    <div className='simpleForm' key={team.id}>  
                        <TeamInfo team={team} />
                    </div>
                ))}

            </div>
        );
    };

export default CommandTaskInfo;