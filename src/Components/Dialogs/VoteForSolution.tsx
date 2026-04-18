import React, { useState, useEffect } from 'react';
import { api } from '../../API/api';
import { TaskSolutionDto, Team, VotingResultsDto } from '../../types';

interface VoteForSolutionProps {
    taskId: string;
    teamId: string;
    teams?: Team[];
    onClose: () => void;
    onVoteComplete: () => void;
}

const VoteForSolution: React.FC<VoteForSolutionProps> = ({ 
    taskId, 
    teamId, 
    teams = [],
    onClose, 
    onVoteComplete 
}) => {
    const [solutions, setSolutions] = useState<TaskSolutionDto[]>([]);
    const [votingResults, setVotingResults] = useState<VotingResultsDto | null>(null);
    const [myVote, setMyVote] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, [taskId, teamId]);

    const loadData = async () => {
    setLoading(true);
    try {

        const profile = await api.GetMyProfile();
        setCurrentUserId(profile?.id || null);
        
        const allSolutions = await api.getTaskSolutionsByTask(taskId);
        
        const myTeam = teams.find(t => t.id === teamId);
        const teamMemberIds = new Set(myTeam?.users.map(u => u.id) || []);
        
        const teamSolutions = allSolutions.filter(solution => 
            teamMemberIds.has(solution.studentId));
        setSolutions(teamSolutions);
        
        const results = await api.getVotingResults(taskId, teamId);
        
        const teamSolutionIds = new Set(teamSolutions.map(s => s.id));
        const filteredResults = {
            ...results,
            results: results.results.filter(r => teamSolutionIds.has(r.solutionId))
        };
        setVotingResults(filteredResults);
        
        const myVoteData = await api.getMyVote(taskId);
        if (myVoteData) {
            setMyVote(myVoteData.solutionId);
            setSelectedSolutionId(myVoteData.solutionId);
        }

        setCurrentUserId(profile?.id || null);
        
        setSolutions(teamSolutions);
    } catch (err) {
        console.error('Failed to load voting data:', err);
    } finally {
        setLoading(false);
    }
};

    const handleVote = async () => {
        if (!selectedSolutionId) {
            alert('Выберите решение для голосования');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.voteForSolution(taskId, selectedSolutionId);
            onVoteComplete();
            onClose();
        } catch (err) {
            console.error('Failed to vote:', err);
            alert('Ошибка при голосовании');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPercentage = (percentage: number) => {
        return `${(percentage).toFixed(1)}%`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Голосование за решение</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                
                <div style={{ padding: '20px' }}>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <>
                            {votingResults && votingResults.results.length > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <h4>Текущие результаты:</h4>
                                    {votingResults.results.map((result) => (
                                        <div key={result.solutionId} style={{ 
                                            marginBottom: '10px',
                                            padding: '10px',
                                            background: '#f3f4f6',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontWeight: 'bold' }}>
                                                Решение #{result.solutionId.slice(0, 8)}
                                            </div>
                                            <div>Голосов: {result.votesCount} ({formatPercentage(result.percentage)})</div>
                                            {!votingResults.isAnonymous && result.voters.length > 0 && (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    Проголосовали: {result.voters.map(v => v.voterName).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <h4>Доступные решения:</h4>
                            {solutions.length === 0 ? (
                                <p>Нет доступных решений для голосования</p>
                            ) : (
                                solutions.map((solution) => (
                                    <div key={solution.id} style={{ 
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: selectedSolutionId === solution.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: selectedSolutionId === solution.id ? '#eff6ff' : 'white'
                                    }}
                                    onClick={() => setSelectedSolutionId(solution.id)}>
                                        <div>
                                            <strong>Решение #{solution.id.slice(0, 8)}</strong>
                                            {myVote === solution.id && (
                                                <span style={{ color: '#10b981', marginLeft: '10px' }}>✓ Ваш голос</span>
                                            )}
                                        </div>
                                        {solution.documents?.map((doc, idx) => (
                                            <div key={idx} style={{ fontSize: '12px' }}>
                                                📎 {doc.fileName}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                            
                            {myVote && (
                                <p style={{ color: '#10b981', marginTop: '10px' }}>
                                    Вы уже проголосовали.
                                </p>
                            )}
                            
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                                <button onClick={onClose}>Отмена</button>
                                <button 
                                    onClick={handleVote} 
                                    disabled={isSubmitting || !selectedSolutionId}
                                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px' }}
                                >
                                    {isSubmitting ? 'Отправка...' : 'Проголосовать'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoteForSolution;