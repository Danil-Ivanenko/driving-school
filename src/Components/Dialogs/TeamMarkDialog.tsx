import React, { useState, useEffect } from 'react';
import { api } from '../../API/api';
import { MetricTranslations, MetricWithValuesDto, Team } from '../../types';
import { useTypedSelector } from '../../store';

interface TeamMarkDialogProps {
    team: Team;
    onClose: () => void;
    onSuccess: () => void;
}

const TeamMarkDialog: React.FC<TeamMarkDialogProps> = ({
    team,
    onClose,
    onSuccess
}) => {

    const [currentMark, setCurrentMark] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [metricsValues, setMetricsValues] = useState<MetricWithValuesDto[]>([]);
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const userId = Number(localStorage.getItem('id'));

    useEffect(() => {
        loadCurrentMark();
    }, [team.id]);
    
    
    const loadCurrentMark = async () => {
        const response = await api.getTeamMark(postState.id, team.users[0].id);
        if (response !== null) {
            setCurrentMark(response);

        }
        const data = await api.getTeamTaskMetricValue(postState.id, team.users[0].id)
        setMetricsValues(data)

    };


    const handleMetricInputChange = async (event: React.ChangeEvent<HTMLInputElement> , metricId : string) => {
            const newValue = Number(event.target.value);
        
            await api.changeMetricToTeam({
                teamId : team.id,
                metricId : metricId,
                value : newValue
            })
            
            await loadCurrentMark();
        
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Оценка команды</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                
                <div style={{ padding: '20px' }}>
                    <p><strong>Команда:</strong> {team.name}</p>
                    <p><strong>Текущая оценка:</strong> {currentMark}</p>
                    
                        {metricsValues.map(metricVal => 
                            (
                                <div key={metricVal.metric.id}>
                                    
                                    
                                    <div>
                                        <label htmlFor="mark" className="baseHeader">{metricVal.metric.name},  {MetricTranslations[metricVal.metric.type]}, min: {metricVal.metric.minValue}, max: {metricVal.metric.maxValue} </label>
                                        <input id="mark" type="number" value={metricVal.values[0].value}   onChange={(e) => handleMetricInputChange(e, metricVal.metric.id)}/>
                                    </div>

                                </div>
                            )
                        )}
                    
                    {error && <div style={{ color: 'red', marginTop: '12px' }}>{error}</div>}
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} style={{ padding: '8px 16px' }}>Отмена</button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMarkDialog;