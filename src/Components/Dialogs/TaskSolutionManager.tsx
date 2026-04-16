import React, { useState, useEffect } from 'react';
import { api } from '../../API/api';
import { useTypedSelector } from '../../store';
import { Post, PostType, PostTypeTranslations, Task } from '../../types';
import { TaskSolutionDto } from '../../types';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../../RoleChecker';
require('../../css/solution.css');


interface TaskSolutionManagerProps {
    taskId: string;
    isTeacher?: boolean;
    onClose: () => void;
}

const TaskSolutionManager: React.FC<TaskSolutionManagerProps> = ({ 
    taskId, 
    isTeacher = false, 
    onClose 
}) => {
    const [solutions, setSolutions] = useState<TaskSolutionDto[]>([]);
    const [mySolution, setMySolution] = useState<TaskSolutionDto | null>(null);
    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [teamStudentIds, setTeamStudentIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [studentNames, setStudentNames] = useState<Map<number, { name: string; surname: string }>>(new Map());

    useEffect(() => {
        loadData();
    }, [taskId]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (isTeacher) {
                const allSolutions = await api.getTaskSolutionsByTask(taskId);
                setSolutions(allSolutions);
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



    const postState = useTypedSelector(state => state.posts.selectedPost!) as Task; 

    const [documents, setDocuments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        loadData();
    }, [taskId]);

    // const loadData = async () => {
    //     setLoading(true);
    //     try {
    //         const allSolutions = await api.getTaskSolutionsByTask(taskId);
    //         setSolutions(allSolutions);

    //         const mySolutions = await api.getMyTaskSolutions();
    //         const my = mySolutions.find(s => s.taskId === taskId);
    //         setMySolution(my || null);
    //     } catch (err) {
    //         console.error('Failed to load solutions:', err);
    //         setError('Ошибка загрузки решений');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                    {!isTeacher && (
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
                    )}

                    <div className="solutions-container">
                        <h4>
                            {isTeacher 
                                ? `Все решения (${solutions.length})` 
                                : `Решения моей команды (${solutions.length})`}
                        </h4>
                        {solutions.length === 0 ? (
                            <p>Нет решений</p>
                        ) : (
                            solutions.map((solution) => (
                                <div key={solution.id} className="solution-card">
                                    {/* <div className="solution-header">
                                        <strong>
                                            {isTeacher 
                                                ? `Студент: ${solution.studentId}` 
                                                : solution.studentId}
                                        </strong>
                                        <span>{formatDate(solution.createdAt)}</span>
                                    </div> */}
                                    <div className="solution-header">
                                        <strong>
                                            {isTeacher 
                                                ? `Студент ID: ${solution.studentId}`
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
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskSolutionManager;