import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetSolutionsByPostIdThunk } from "../../reducers/posts-reducer";
import { ErrorResponse, MetricTranslations, MetricWithValuesDto } from "../../types";
import axios from "axios";
const StudentMetricsDialog: React.FC<{ userId: number}> = ({ userId}) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    //const userMyId = Number(localStorage.getItem('id'));
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const [metricsValues, setMetricsValues] = useState<MetricWithValuesDto[]>([]);
    const [mark , setMark] = useState<number | null>(0);
    useEffect(() => {
        fetchMark();
    }, []);
    
    const fetchMark = async () => {
        const metrics = await api.getTeamTaskMetricValue(postState.id,userId);
            setMetricsValues(metrics.map(metric => ({
                ...metric,
                values: metric.values.filter(value => value.userId === userId)
            })));
        const mark = await api.getUserTeamMark(postState.id, userId)
        setMark(mark);
    };
    
    const handleMarkInputChange = async (event: React.ChangeEvent<HTMLInputElement> , metricId : string) => {
        await api.changeMetricToUser({
            metricId : metricId,
            userId : userId,
            value : Number(event.target.value)
        })
            
            fetchMark();
        
    };

    const openDialog = async ()  => {
        setOpen(true)
        await fetchMark()
    }


    return(
        <>

             <button
                                className={styles.button}
                                style={{ marginLeft: '10px', fontSize: '12px' }}
                                 onClick={openDialog}
                            >
                                Оценка : {mark}
                </button>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Оценить</p>
                        {metricsValues.map(metricVal => 
                            (
                                <div key={metricVal.metric.id}>
                                    
                                    
                                    <div>
                                        <label htmlFor="mark" className="baseHeader">{metricVal.metric.name},  {MetricTranslations[metricVal.metric.type]}, min: {metricVal.metric.minValue}, max: {metricVal.metric.maxValue} </label>
                                        <input id="mark" type="number" value={metricVal.values[0].value}   onChange={(e) => handleMarkInputChange(e, metricVal.metric.id)}/>
                                    </div>

                                </div>
                            )
                        )}

                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >

                            
                            <button className={styles.button} type="button"  onClick={() => setOpen(false)} >
                                Назад
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default StudentMetricsDialog;