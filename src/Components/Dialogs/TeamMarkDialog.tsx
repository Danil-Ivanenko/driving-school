import React, { useState, useEffect } from 'react';
import { api } from '../../API/api';

interface TeamMarkDialogProps {
    teamId: string;
    teamName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const TeamMarkDialog: React.FC<TeamMarkDialogProps> = ({
    teamId,
    teamName,
    onClose,
    onSuccess
}) => {
    const [mark, setMark] = useState<number>(5);
    const [currentMark, setCurrentMark] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCurrentMark();
    }, [teamId]);

    const loadCurrentMark = async () => {
        const response = await api.getTeamMark(teamId);
        if (response !== null) {
            setCurrentMark(response);
            setMark(response);
        }
    };

    const handleSubmit = async () => {
        if (mark < 1 || mark > 5) {
            setError('Оценка должна быть от 1 до 5');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.setTeamMark(teamId, mark);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Ошибка при сохранении оценки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Оценка команды</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                
                <div style={{ padding: '20px' }}>
                    <p><strong>Команда:</strong> {teamName}</p>
                    <p><strong>Текущая оценка:</strong> {currentMark !== null ? currentMark : 'не выставлена'}</p>
                    
                    <div style={{ marginTop: '16px' }}>
                        <label>Новая оценка (1-5):</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            step={0.5}
                            value={mark}
                            onChange={(e) => setMark(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                        />
                    </div>
                    
                    {error && <div style={{ color: 'red', marginTop: '12px' }}>{error}</div>}
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} style={{ padding: '8px 16px' }}>Отмена</button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none' }}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMarkDialog;