import React, { useEffect, useState } from 'react';
import { api } from '../../API/api';
import { Team, TaskSolutionDto } from '../../types';
import styles from '../../css/login.module.css';

interface P2PPairTeamDto {
    id: string;
    task: any;
    reviewerTeam: Team;
    ownerTeam: Team;
    targetTaskSolutionId: string;
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
}

interface P2PManagerProps {
    taskId: string;
    teams: Team[];
    onClose: () => void;
}

const statusTranslations: Record<string, string> = {
    PENDING: 'Ожидает',
    COMPLETED: 'Завершено',
    EXPIRED: 'Просрочено'
};

const statusColors: Record<string, string> = {
    PENDING: '#f59e0b',
    COMPLETED: '#10b981',
    EXPIRED: '#ef4444'
};

const P2PManager: React.FC<P2PManagerProps> = ({ taskId, teams, onClose }) => {
    const [pairs, setPairs] = useState<P2PPairTeamDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Для назначения новой пары
    const [assignMode, setAssignMode] = useState(false);
    const [reviewerTeamId, setReviewerTeamId] = useState('');
    const [ownerTeamId, setOwnerTeamId] = useState('');
    const [solutions, setSolutions] = useState<TaskSolutionDto[]>([]);
    const [targetSolutionId, setTargetSolutionId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Для переназначения
    const [reassignPairId, setReassignPairId] = useState<string | null>(null);
    const [newReviewerTeamId, setNewReviewerTeamId] = useState('');
    const [isReassigning, setIsReassigning] = useState(false);

    useEffect(() => {
        loadPairs();
    }, [taskId]);

    useEffect(() => {
        if (assignMode) {
            loadSolutions();
        }
    }, [assignMode]);

    const loadPairs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getP2PPairsTeam(taskId);
            setPairs(data || []);
        } catch (e) {
            setError('Не удалось загрузить P2P пары');
        } finally {
            setLoading(false);
        }
    };

    const loadSolutions = async () => {
        try {
            const data = await api.getTaskSolutionsByTask(taskId);
            setSolutions(data || []);
        } catch (e) {
            console.error('Failed to load solutions:', e);
        }
    };

    const handleAssign = async () => {
        if (!reviewerTeamId || !ownerTeamId || !targetSolutionId) {
            setError('Заполните все поля для назначения');
            return;
        }
        if (reviewerTeamId === ownerTeamId) {
            setError('Проверяющая и проверяемая команда не могут совпадать');
            return;
        }
        setIsAssigning(true);
        setError(null);
        try {
            await api.assignP2PTeam({
                taskId,
                reviewerTeamId,
                ownerTeamId,
                targetTaskSolutionId: targetSolutionId
            });
            setAssignMode(false);
            setReviewerTeamId('');
            setOwnerTeamId('');
            setTargetSolutionId('');
            await loadPairs();
        } catch (e) {
            setError('Ошибка при назначении пары');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleReassign = async (pairId: string) => {
        if (!newReviewerTeamId) {
            setError('Выберите новую проверяющую команду');
            return;
        }
        setIsReassigning(true);
        setError(null);
        try {
            await api.reassignP2PTeam(pairId, { newReviewerTeamId });
            setReassignPairId(null);
            setNewReviewerTeamId('');
            await loadPairs();
        } catch (e) {
            setError('Ошибка при переназначении');
        } finally {
            setIsReassigning(false);
        }
    };

    const handleDelete = async (pairId: string) => {
        if (!window.confirm('Удалить это P2P назначение?')) return;
        try {
            await api.deleteP2PTeam(pairId);
            await loadPairs();
        } catch (e) {
            setError('Ошибка при удалении назначения');
        }
    };

    const getTeamName = (teamId: string) => {
        return teams.find(t => t.id === teamId)?.name || teamId;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>P2P оценивание</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {error && (
                <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {/* Кнопка назначить пару */}
            {!assignMode && (
                <button
                    className={styles.button}
                    onClick={() => { setAssignMode(true); setError(null); }}
                >
                    + Назначить пару
                </button>
            )}

            {/* Форма назначения */}
            {assignMode && (
                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Новое назначение</p>

                    <div>
                        <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Проверяющая команда:</label>
                        <select
                            value={reviewerTeamId}
                            onChange={e => setReviewerTeamId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">— выберите —</option>
                            {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Проверяемая команда:</label>
                        <select
                            value={ownerTeamId}
                            onChange={e => setOwnerTeamId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">— выберите —</option>
                            {teams.filter(t => t.id !== reviewerTeamId).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Решение для проверки:</label>
                        <select
                            value={targetSolutionId}
                            onChange={e => setTargetSolutionId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">— выберите —</option>
                            {solutions.map(s => (
                                <option key={s.id} value={s.id}>
                                    Решение от {new Date(s.createdAt).toLocaleDateString()} (id: {s.id.slice(0, 8)}...)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={styles.button} onClick={handleAssign} disabled={isAssigning}>
                            {isAssigning ? 'Назначение...' : 'Назначить'}
                        </button>
                        <button className={styles.button} onClick={() => { setAssignMode(false); setError(null); }} style={{ background: '#6b7280' }}>
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {/* Список пар */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>Загрузка...</p>
            ) : pairs.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>Нет P2P назначений</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pairs.map(pair => (
                        <div key={pair.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <div style={{ fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}>Проверяет: </span>
                                        <strong>{pair.reviewerTeam?.name || getTeamName(pair.reviewerTeam?.id)}</strong>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}>Проверяет работу: </span>
                                        <strong>{pair.ownerTeam?.name || getTeamName(pair.ownerTeam?.id)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: statusColors[pair.status] + '22',
                                            color: statusColors[pair.status],
                                            fontWeight: 'bold'
                                        }}>
                                            {statusTranslations[pair.status]}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => { setReassignPairId(pair.id); setNewReviewerTeamId(''); setError(null); }}
                                        style={{ padding: '4px 10px', fontSize: '13px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Переназначить
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pair.id)}
                                        style={{ padding: '4px 10px', fontSize: '13px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>

                            {/* Форма переназначения */}
                            {reassignPairId === pair.id && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <select
                                        value={newReviewerTeamId}
                                        onChange={e => setNewReviewerTeamId(e.target.value)}
                                        style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">— новая проверяющая команда —</option>
                                        {teams.filter(t => t.id !== pair.ownerTeam?.id).map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleReassign(pair.id)}
                                        disabled={isReassigning}
                                        style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        {isReassigning ? '...' : 'Сохранить'}
                                    </button>
                                    <button
                                        onClick={() => setReassignPairId(null)}
                                        style={{ padding: '6px 12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default P2PManager;
