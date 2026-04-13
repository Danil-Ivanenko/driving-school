import React, { useState, useEffect } from 'react';
import { api } from '../../API/api';
import { TaskSolutionDto } from '../../types';
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
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [taskId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const allSolutions = await api.getTaskSolutionsByTask(taskId);
            setSolutions(allSolutions);

            const mySolutions = await api.getMyTaskSolutions();
            const my = mySolutions.find(s => s.taskId === taskId);
            setMySolution(my || null);
        } catch (err) {
            console.error('Failed to load solutions:', err);
            setError('Ошибка загрузки решений');
        } finally {
            setLoading(false);
        }
    };

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
                        <h4>Все решения ({solutions.length})</h4>
                        {solutions.length === 0 ? (
                            <p>Нет решений</p>
                        ) : (
                            solutions.map((solution) => (
                                <div key={solution.id} className="solution-card">
                                    <div className="solution-header">
                                        <strong>Студент ID: {solution.studentId}</strong>
                                        <span>{formatDate(solution.createdAt)}</span>
                                    </div>
                                    
                                    {solution.documents?.map((doc, idx) => (
                                        <div key={idx} className="solution-file">
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                📎 {doc.fileName}
                                            </a>
                                        </div>
                                    ))}
                                    
                                    {solution.mark !== undefined && (
                                        <div className="solution-mark">
                                            Оценка: <strong>{solution.mark}</strong>
                                        </div>
                                    )}
                                    
                                    {isTeacher && !solution.mark && (
                                        <div className="solution-actions">
                                            <button>Оценить</button>
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