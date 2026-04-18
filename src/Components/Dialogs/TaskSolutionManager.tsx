import React, { useState, useEffect } from 'react';
import { api } from '../../API/api';
import { useTypedSelector } from '../../store';
import { Post, PostType, PostTypeTranslations, Task, Team } from '../../types';
import { TaskSolutionDto } from '../../types';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../../RoleChecker';
import VoteForSolution from './VoteForSolution';
require('../../css/solution.css');


interface TaskSolutionManagerProps {
    taskId: string;
    taskType?: string;
    teamId?: string;
    isCaptain?: boolean;
    isTeacher?: boolean;
    teams?: Team[];
    onClose: () => void;
}

const TaskSolutionManager: React.FC<TaskSolutionManagerProps> = ({ 
    // taskId, 
    // isTeacher = false, 
    // onClose 
    taskId,
    taskType = 'FIRST',
    teamId,
    isCaptain = false,
    isTeacher = false,
    teams = [],
    onClose 
}) => {
    const [solutions, setSolutions] = useState<TaskSolutionDto[]>([]);
    const [mySolution, setMySolution] = useState<TaskSolutionDto | null>(null);
    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [teamStudentIds, setTeamStudentIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [studentNames, setStudentNames] = useState<Map<number, { name: string; surname: string }>>(new Map());

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const postState = useTypedSelector(state => state.posts.selectedPost!) as Task; 

    useEffect(() => {
        loadData();
    }, [taskId]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (isTeacher) {
                const allSolutions = await api.getTaskSolutionsByTask(taskId);
                setSolutions(allSolutions);
                await loadTeamNames(allSolutions);
            } else {

                const myTeam = await api.getMyTeamByTask(taskId);
                
                if (myTeam) {
                    const teamMembersMap = new Map();
                    myTeam.users.forEach(user => {
                        teamMembersMap.set(user.id, { 
                            name: user.name, 
                            surname: user.surname 
                        });
                    });
                    setStudentNames(teamMembersMap);
                    
                    const allSolutions = await api.getTaskSolutionsByTask(taskId);
                    const teamSolutions = allSolutions.filter(s => teamMembersMap.has(s.studentId));
                    setSolutions(teamSolutions);
                } else {
                    setSolutions([]);
                }
                
                const mySolutions = await api.getMyTaskSolutions();
                const my = mySolutions.find(s => s.taskId === taskId);
                setMySolution(my || null);
            }
        } catch (err) {
            console.error('Failed to load solutions:', err);
        } finally {
            setLoading(false);
        }
    };


    const [documents, setDocuments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isInTeam, setIsInTeam] = useState<boolean>(false);
    const [loadingTeamCheck, setLoadingTeamCheck] = useState(true);
    const [mySolutionExists, setMySolutionExists] = useState(false);

    const [teamNames, setTeamNames] = useState<Map<string, string>>(new Map());

    const [viewMode, setViewMode] = useState<'all' | 'selected'>('all');
    const [selectedSolution, setSelectedSolution] = useState<TaskSolutionDto | null>(null); 
    const [isSelecting, setIsSelecting] = useState(false); 
    const [selectedSolutions, setSelectedSolutions] = useState<TaskSolutionDto[]>([]);

    useEffect(() => {
        loadData();
        if (!isTeacher && teamId) {
            refreshTeamData();
        }
    }, [taskId, teamId]);


    const refreshTeamData = async () => {
        try {
            const myTeam = await api.getMyTeamByTask(taskId);
            if (myTeam) {
                const teamMembersMap = new Map();
                myTeam.users.forEach(user => {
                    teamMembersMap.set(user.id, { 
                        name: user.name, 
                        surname: user.surname 
                    });
                });
                setStudentNames(teamMembersMap);
                
                const allSolutions = await api.getTaskSolutionsByTask(taskId);
                const teamSolutions = allSolutions.filter(s => teamMembersMap.has(s.studentId));
                setSolutions(teamSolutions);
            }
        } catch (err) {
            console.error('Failed to refresh team data:', err);
        }
    };

    const loadSelectedSolutions = async () => {
        if (!isTeacher) return;
        
        console.log('Loading selected solutions for taskId:', taskId);
        
        try {
            const solutions = await api.getSelectedSolutions(taskId);
            console.log('Received selected solutions:', solutions);
            setSelectedSolutions(Array.isArray(solutions) ? solutions : []);
        } catch (err) {
            console.error('Failed to load selected solutions:', err);
            setSelectedSolutions([]);
        }
    };

    const loadSelectedSolutionForStudent = async () => {
        if (!teamId) return;
        
        try {
            const solution = await api.getSelectedSolution(taskId, teamId);
            setSelectedSolution(solution);
        } catch (err) {
            console.error('Failed to load selected solution:', err);
            setSelectedSolution(null);
        }
    };

    // const loadSelectedSolution = async () => {
    //     try {
    //         const solution = await api.getSelectedSolution(taskId, teamId);
    //         setSelectedSolution(solution);
    //     } catch (err) {
    //         console.error('Failed to load selected solution:', err);
    //         setSelectedSolution(null);
    //     }
    // };

    const loadTeamNames = async (solutionsList: TaskSolutionDto[]) => {
        const teamNamesMap = new Map<string, string>();
        
        const uniqueTeamIds = Array.from(new Set(solutionsList.map(s => s.teamId).filter(Boolean)));
        
        for (const teamId of uniqueTeamIds) {
            if (teamId) {
                try {
                    const team = await api.getTeam(teamId);
                    if (team) {
                        teamNamesMap.set(teamId, team.name);
                    }
                } catch (err) {
                    console.error(`Failed to load team ${teamId}:`, err);
                    teamNamesMap.set(teamId, `Команда ${teamId.slice(0, 8)}`);
                }
            }
        }
        
        setTeamNames(teamNamesMap);
    };

    const getTeamNameByStudentId = (studentId: number): string => {
        if (!teams || teams.length === 0) return `Студент ID: ${studentId}`;
        
        const team = teams.find(t => 
            t.users?.some(user => user.id === studentId)
        );
        
        return team ? team.name : `Студент ID: ${studentId}`;
    };

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
        loadData();
    }, [taskId]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        if (documents.length === 0) {
            setError('Выберите файлы для загрузки');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (mySolution) {
                await api.updateTaskSolution(mySolution.id, documents);
            } else {
                await api.createTaskSolution(taskId, documents);
            }
            await loadData();
            setDocuments([]);
        } catch (err) {
            setError('Ошибка при отправке решения');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!mySolution) return;
        
        if (window.confirm('Вы уверены, что хотите удалить решение?')) {
            setIsSubmitting(true);
            try {
                await api.deleteTaskSolution(mySolution.id);
                await loadData();
            } catch (err) {
                setError('Ошибка при удалении решения');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU');
    };

    const canStudentSubmit = () => {
        if (isTeacher) return true;
        
        switch (taskType) {
            case 'CAPITAN':
                return isCaptain;
            case 'FIRST':
                return !mySolutionExists;
            case 'LAST':
                return true; 
            default:
                return true;
        }
    };

    const handleViewModeChange = (mode: 'all' | 'selected') => {
        setViewMode(mode);
        if (mode === 'selected') {
            if (isTeacher) {
                loadSelectedSolutions();
            } else {
                loadSelectedSolutionForStudent();
            }
        }
    };

    const showVoting = () => {
        return taskType === 'DEMOCRATIC' || taskType === 'QUALIFIED';
    };
    const [showVotingDialog, setShowVotingDialog] = useState(false);

    return (
        <div className="solutions-list">
            <div className="modal-header">
                <h3>Решения задания</h3>
                <button onClick={onClose}>✕</button>
            </div>

            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <>
                    {/* {isTeacher && (
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            padding: '10px 20px',
                            borderBottom: '1px solid #e5e7eb',
                            background: '#f9fafb'
                        }}>
                            <button
                                onClick={() => setViewMode('all')}
                                style={{
                                    padding: '8px 16px',
                                    background: viewMode === 'all' ? '#3b82f6' : '#e5e7eb',
                                    color: viewMode === 'all' ? 'white' : '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Все решения ({solutions.length})
                            </button>
                            <button
                                onClick={() => {
                                    setViewMode('selected');
                                    loadSelectedSolution();
                                }}
                                style={{
                                    padding: '8px 16px',
                                    background: viewMode === 'selected' ? '#3b82f6' : '#e5e7eb',
                                    color: viewMode === 'selected' ? 'white' : '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Выбранные решения
                            </button>
                        </div>
                    )} */}
                    {isTeacher && (
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            padding: '10px 20px',
                            borderBottom: '1px solid #e5e7eb',
                            background: '#f9fafb'
                        }}>
                            <button
                                onClick={() => handleViewModeChange('all')}
                                style={{
                                    padding: '8px 16px',
                                    background: viewMode === 'all' ? '#3b82f6' : '#e5e7eb',
                                    color: viewMode === 'all' ? 'white' : '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Все решения ({solutions.length})
                            </button>
                            <button
                                onClick={() => handleViewModeChange('selected')}
                                style={{
                                    padding: '8px 16px',
                                    background: viewMode === 'selected' ? '#3b82f6' : '#e5e7eb',
                                    color: viewMode === 'selected' ? 'white' : '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Выбранные решения
                            </button>
                        </div>
                    )}

                    {viewMode === 'all' && (
                        <div className="solutions-container">
                            <h4>Все решения ({solutions.length})</h4>
                            {solutions.length === 0 ? (
                                <p>Нет решений</p>
                            ) : (
                                solutions.map((solution) => (
                                    <div key={solution.id} className="solution-card">
                                        <div className="solution-header">
                                            <strong>
                                                {isTeacher 
                                                    ? `Команда: ${getTeamNameByStudentId(solution.studentId)}`
                                                    : studentNames.get(solution.studentId) 
                                                        ? `${studentNames.get(solution.studentId)?.surname} ${studentNames.get(solution.studentId)?.name}`
                                                        : `ID: ${solution.studentId}`}
                                            </strong>
                                            <span>{formatDate(solution.createdAt)}</span>
                                        </div>
                                        
                                        {solution.documents?.map((doc, idx) => (
                                            <div key={idx} className="solution-file">
                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    📎 {doc.fileName}
                                                </a>
                                            </div>
                                        ))}
                                        
                                        {solution.mark !== undefined && solution.mark !== null && (
                                            <div className="solution-mark">
                                                Оценка: <strong>{solution.mark}</strong>
                                            </div>
                                        )}
                                        
                                        {selectedSolution?.id === solution.id && (
                                            <div style={{ 
                                                marginTop: '8px', 
                                                padding: '4px 8px', 
                                                background: '#d1fae5', 
                                                color: '#065f46',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                ВЫБРАННОЕ РЕШЕНИЕ
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {/* {viewMode === 'selected' && (
                        <div className="solutions-container">
                            <h4>Выбранное решение</h4>
                            {!selectedSolution ? (
                                <p>Нет выбранных решений.</p>
                            ) : (
                                <div className="solution-card" style={{ border: '2px solid #10b981' }}>
                                    <div className="solution-header">
                                        <strong>
                                            Команда: {getTeamNameByStudentId(selectedSolution.studentId)}
                                        </strong>
                                        <span>{formatDate(selectedSolution.createdAt)}</span>
                                    </div>
                                    
                                    {selectedSolution.documents?.map((doc, idx) => (
                                        <div key={idx} className="solution-file">
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                📎 {doc.fileName}
                                            </a>
                                        </div>
                                    ))}
                                    
                                    {selectedSolution.mark !== undefined && selectedSolution.mark !== null && (
                                        <div className="solution-mark">
                                            Оценка: <strong>{selectedSolution.mark}</strong>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )} */}
                    {viewMode === 'selected' && (
                        <div className="solutions-container">
                            <h4>
                                {isTeacher 
                                    ? `Выбранные решения по командам (${selectedSolutions.length})` 
                                    : 'Выбранное решение'}
                            </h4>
                            
                            {selectedSolutions.length === 0 && !selectedSolution ? (
                                <p>Нет выбранных решений.</p>
                            ) : isTeacher ? (
                                selectedSolutions.map((solution) => (
                                    <div key={solution.id} className="solution-card" style={{ border: '2px solid #10b981', marginBottom: '16px' }}>
                                        <div className="solution-header">
                                            <strong>
                                                Команда: {getTeamNameByStudentId(solution.studentId)}
                                            </strong>
                                            <span>{formatDate(solution.createdAt)}</span>
                                        </div>
                                        
                                        {solution.documents?.map((doc, idx) => (
                                            <div key={idx} className="solution-file">
                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    📎 {doc.fileName}
                                                </a>
                                            </div>
                                        ))}
                                        
                                        {solution.mark !== undefined && solution.mark !== null && (
                                            <div className="solution-mark">
                                                Оценка: <strong>{solution.mark}</strong>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                selectedSolution && (
                                    <div className="solution-card" style={{ border: '2px solid #10b981' }}>
                                        <div className="solution-header">
                                            <strong>
                                                Команда: {getTeamNameByStudentId(selectedSolution.studentId)}
                                            </strong>
                                            <span>{formatDate(selectedSolution.createdAt)}</span>
                                        </div>
                                        
                                        {selectedSolution.documents?.map((doc, idx) => (
                                            <div key={idx} className="solution-file">
                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    📎 {doc.fileName}
                                                </a>
                                            </div>
                                        ))}
                                        
                                        {selectedSolution.mark !== undefined && selectedSolution.mark !== null && (
                                            <div className="solution-mark">
                                                Оценка: <strong>{selectedSolution.mark}</strong>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {!isTeacher && (
                        <>
                            {showVoting() && solutions.length > 0 && (
                                <div style={{ marginBottom: '20px', padding: '0 20px' }}>
                                    <button 
                                        onClick={() => setShowVotingDialog(true)}
                                        style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        Проголосовать за решение
                                    </button>
                                </div>
                            )}
                            
                            {canStudentSubmit() ? (
                                <div className="solution-form">
                                    <h4>{mySolution ? 'Редактировать решение' : 'Отправить решение'}</h4>
                                    <div>
                                        <label>Документы:</label>
                                        <input 
                                            type="file" 
                                            multiple 
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                        />
                                        {mySolution?.documents?.map(doc => (
                                            <p key={doc.fileUrl}>
                                                Текущий файл: {doc.fileName}
                                            </p>
                                        ))}
                                    </div>
                                    {error && <div className="error">{error}</div>}
                                    <div className="form-buttons">
                                        <button onClick={handleSubmit} disabled={isSubmitting}>
                                            {isSubmitting ? 'Отправка...' : (mySolution ? 'Обновить' : 'Отправить')}
                                        </button>
                                        {mySolution && (
                                            <button onClick={handleDelete} disabled={isSubmitting}>
                                                Удалить
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '16px', margin: '0 20px 20px 20px', background: '#fee2e2', borderRadius: '8px', textAlign: 'center' }}>
                                    {taskType === 'CAPITAN' && 'Только капитан команды может отправлять решение'}
                                    {taskType === 'FIRST' && 'Решение уже было отправлено. Первое решение будет проверено.'}
                                    {taskType === 'LAST' && 'Ожидается последнее решение команды'}
                                    {!taskType && 'Вы не можете отправить решение'}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {showVotingDialog && (
                <VoteForSolution
                    taskId={taskId}
                    teamId={teamId || ''}
                    teams={teams}   
                    onClose={() => setShowVotingDialog(false)}
                    onVoteComplete={() => {
                        setShowVotingDialog(false);
                        loadData();
                    }}
                />
            )}
        </div>
    );

};

export default TaskSolutionManager;