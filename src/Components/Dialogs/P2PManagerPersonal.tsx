import React, { useEffect, useState } from 'react';
import { api } from '../../API/api';
import { ChannelUser, StudentSolution } from '../../types';
import styles from '../../css/login.module.css';

interface P2PPairPersonalDto {
    id: string;
    post: any;
    reviewer: ChannelUser;
    owner: ChannelUser;
    targetSolutionId: string;
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
}

interface P2PManagerPersonalProps {
    postId: string;
    channelUsers: ChannelUser[];
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

const P2PManagerPersonal: React.FC<P2PManagerPersonalProps> = ({ postId, channelUsers, onClose }) => {
    const [pairs, setPairs] = useState<P2PPairPersonalDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Для назначения
    const [assignMode, setAssignMode] = useState(false);
    const [reviewerId, setReviewerId] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [solutions, setSolutions] = useState<StudentSolution[]>([]);
    const [targetSolutionId, setTargetSolutionId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Для переназначения
    const [reassignPairId, setReassignPairId] = useState<string | null>(null);
    const [newReviewerId, setNewReviewerId] = useState('');
    const [isReassigning, setIsReassigning] = useState(false);

    useEffect(() => {
        loadPairs();
        loadSolutions();
    }, [postId]);

    const loadPairs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getP2PPairsPersonal(postId);
            setPairs(data || []);
        } catch (e) {
            setError('Не удалось загрузить P2P пары');
        } finally {
            setLoading(false);
        }
    };

    const loadSolutions = async () => {
        try {
            const data = await api.GetPostSolutions(postId);
            setSolutions(data || []);
        } catch (e) {
            console.error('Failed to load solutions:', e);
        }
    };

    const handleAssign = async () => {
        if (!reviewerId || !ownerId || !targetSolutionId) {
            setError('Заполните все поля для назначения');
            return;
        }
        if (reviewerId === ownerId) {
            setError('Проверяющий и проверяемый не могут совпадать');
            return;
        }
        setIsAssigning(true);
        setError(null);
        try {
            await api.assignP2PPersonal({
                postId,
                reviewerId: Number(reviewerId),
                ownerId: Number(ownerId),
                targetSolutionId
            });
            setAssignMode(false);
            setReviewerId('');
            setOwnerId('');
            setTargetSolutionId('');
            await loadPairs();
        } catch (e) {
            setError('Ошибка при назначении пары');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleReassign = async (pairId: string) => {
        if (!newReviewerId) {
            setError('Выберите нового проверяющего');
            return;
        }
        setIsReassigning(true);
        setError(null);
        try {
            await api.reassignP2PPersonal(pairId, { newReviewerId: Number(newReviewerId) });
            setReassignPairId(null);
            setNewReviewerId('');
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
            await api.deleteP2PPersonal(pairId);
            await loadPairs();
        } catch (e) {
            setError('Ошибка при удалении назначения');
        }
    };

    const getUserName = (user: ChannelUser) => `${user.name} ${user.surname}`;

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

            {!assignMode && (
                <button className={styles.button} onClick={() => { setAssignMode(true); setError(null); }}>
                    + Назначить пару
                </button>
            )}

            {assignMode && (
                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Новое назначение</p>

                    <div>
                        <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Проверяющий:</label>
                        <select value={reviewerId} onChange={e => setReviewerId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="">— выберите —</option>
                            {channelUsers.map(u => (
                                <option key={u.id} value={u.id}>{getUserName(u)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Проверяемый:</label>
                        <select value={ownerId} onChange={e => setOwnerId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="">— выберите —</option>
                            {channelUsers.filter(u => String(u.id) !== reviewerId).map(u => (
                                <option key={u.id} value={u.id}>{getUserName(u)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Решение для проверки:</label>
                        <select value={targetSolutionId} onChange={e => setTargetSolutionId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="">— выберите —</option>
                            {solutions.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.studentName} — {new Date(s.submittedAt).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={styles.button} onClick={handleAssign} disabled={isAssigning}>
                            {isAssigning ? 'Назначение...' : 'Назначить'}
                        </button>
                        <button className={styles.button} onClick={() => { setAssignMode(false); setError(null); }}
                            style={{ background: '#6b7280' }}>
                            Отмена
                        </button>
                    </div>
                </div>
            )}

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
                                        <strong>{pair.reviewer ? getUserName(pair.reviewer) : '—'}</strong>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}>Проверяет работу: </span>
                                        <strong>{pair.owner ? getUserName(pair.owner) : '—'}</strong>
                                    </div>
                                    <span style={{
                                        fontSize: '12px', padding: '2px 8px', borderRadius: '12px',
                                        background: statusColors[pair.status] + '22',
                                        color: statusColors[pair.status], fontWeight: 'bold',
                                        display: 'inline-block', width: 'fit-content'
                                    }}>
                                        {statusTranslations[pair.status]}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button onClick={() => { setReassignPairId(pair.id); setNewReviewerId(''); setError(null); }}
                                        style={{ padding: '4px 10px', fontSize: '13px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Переназначить
                                    </button>
                                    <button onClick={() => handleDelete(pair.id)}
                                        style={{ padding: '4px 10px', fontSize: '13px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Удалить
                                    </button>
                                </div>
                            </div>

                            {reassignPairId === pair.id && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <select value={newReviewerId} onChange={e => setNewReviewerId(e.target.value)}
                                        style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                        <option value="">— новый проверяющий —</option>
                                        {channelUsers.filter(u => u.id !== pair.owner?.id).map(u => (
                                            <option key={u.id} value={u.id}>{getUserName(u)}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleReassign(pair.id)} disabled={isReassigning}
                                        style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                                        {isReassigning ? '...' : 'Сохранить'}
                                    </button>
                                    <button onClick={() => setReassignPairId(null)}
                                        style={{ padding: '6px 12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
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

export default P2PManagerPersonal;
