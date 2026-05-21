import { useEffect, useState } from "react";
import { useTypedSelector } from "../store";
import { GradeTableDto, MarkTranslations, PostTypeTranslations } from "../types";
import { api } from "../API/api";

const UsersGradesTable: React.FC = () => {
    const channelId = useTypedSelector(state => state.channels.selectedChannel!.id);
    const [table, setTable] = useState<GradeTableDto | null>(null);

    useEffect(() => {
        getTable();
    }, [channelId]);

    const getTable = async () => {
        const data = await api.getGradeTableByChannelId(channelId) as GradeTableDto;
        setTable(data);
    };

    if (!table) {
        return <div>Загрузка...</div>;
    }

    return (
 <div className="simpleForm">
    <style>
        {`
            .table-wrapper {
                max-height: 70vh;
                overflow-y: auto;
                overflow-x: auto;
                position: relative;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            .grades-table {
                width: 100%;
                border-collapse: collapse;
                font-family: Arial, sans-serif;
                min-width: 600px; 
            }
            
            .grades-table th,
            .grades-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
                white-space: nowrap; 
            }
            

            .grades-table td:first-child,
            .grades-table th:first-child {
                position: sticky;
                left: 0;
                background-color: white;
                z-index: 1;
            }
            
            .grades-table th:first-child {
                z-index: 2;
                background-color: #f4f4f4;
            }
            
            .grades-table th {
                background-color: #f4f4f4;
                font-weight: bold;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            

            .grades-table th:first-child {
                left: 0;
                z-index: 3;
            }
            
            .grades-table tr:hover {
                background-color: #f5f5f5;
            }
            
            .grade-value {
                font-weight: 500;
            }
            
            .control-ids {
                font-size: 12px;
                color: #666;
                margin-top: 4px;
                white-space: normal; 
                word-break: break-word;
            }
            
            .channel-grade {
                font-weight: bold;
                color: #1976d2;
            }
            
            /* Стили для скроллбаров */
            .table-wrapper::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            
            .table-wrapper::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            
            .table-wrapper::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }
            
            .table-wrapper::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `}
    </style>
    
    <div className="table-wrapper">
        <table className="grades-table">
            <thead>
                <tr>
                    <th>Студент</th>
                    
                    {table.targets.map((target) => (
                        <th key={target.targetId}>
                            {target.label}
                            <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>
                                {MarkTranslations[target.type]}
                            </div>
                        </th>
                    ))}
                    <th>Итоговая оценка</th>
                </tr>
            </thead>
            <tbody>
                {table.rows.map((row) => (
                    <tr key={row.userId}>
                        <td>{row.userName}</td>
                        
                        {row.grades.map((grade) => (
                           
                             
                                <td >
                                    {grade.rawValue}
                                </td>
                            
                        ))}


                        <td className="channel-grade">{row.channelGrade}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
    );
};

export default UsersGradesTable