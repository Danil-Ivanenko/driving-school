
import axios from "axios";
import { useTypedSelector } from "../store";
import { useEffect, useState } from "react";
import { MetricTranslations, MetricWithValuesDto } from "../types";
import { api } from "../API/api";
const TeamTaskMetricsForUser: React.FC<{ userId: number}> = ({ userId}) => {
        const postState = useTypedSelector(state => state.posts.selectedPost!); 
        const [metricsValues, setMetricsValues] = useState<MetricWithValuesDto[]>([]);
        const [mark , setMark] = useState<number | null>(0);
        const userMyId = Number(localStorage.getItem('id'));

        useEffect(() => {
            if(userMyId == userId)
            {
                fetchMark();
            }
            
        }, []);
        
        const fetchMark = async () => {
            const metrics = await api.getTeamTaskMetricValue(postState.id, userId);
            console.log(metrics)
            setMetricsValues(metrics.map(metric => ({
                ...metric,
                values: metric.values.filter(value => value.userId === userId)
            })));
            const mark = await api.getUserTeamMark(postState.id, userId)
            setMark(mark);
        };

    return(
    <>
        {metricsValues.length > 0 && (
            <div> 
                <p className="baseHeader">Оценка: {mark}</p>
                {metricsValues.map(metricVal => (
                    <div key={metricVal.metric.id}>
                        <div>
                            <p className="baseHeader">
                                {metricVal.metric.name}, тип: {MetricTranslations[metricVal.metric.type]}, 
                                min: {metricVal.metric.minValue}, max: {metricVal.metric.maxValue}
                            </p>
                            <p className="baseHeader">значение: {metricVal.values[0].value}</p>
                            <hr />
                        </div>
                    </div>
                ))}
            </div>
        )}
    </>
);
}

export default TeamTaskMetricsForUser;