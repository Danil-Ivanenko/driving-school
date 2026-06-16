import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetSolutionsByPostIdThunk } from "../../reducers/posts-reducer";
import { ErrorResponse, MetricTranslations, MetricWithValuesDto } from "../../types";
import axios from "axios";
const OrderP2TeamTaskDialog: React.FC<{ userId: number, teamId: string, postId :string}> = ({ userId, teamId, postId}) => {
    const [isOpen, setOpen] = useState<boolean>(false);



    const [metricsValues, setMetricsValues] = useState<MetricWithValuesDto[]>([]);
    const [mark , setMark] = useState<number>(0);
    useEffect(() => {
        fetchMark();
    }, []);
    
    const fetchMark = async () => {
        const data =  await api.getTeamMark(postId, userId);
        setMark(data ?? 0); 
    };
    
    const handleMarkInputChange = async (event: React.ChangeEvent<HTMLInputElement> , metricId : string) => {

        await api.changeMetricToTeam({
            teamId : teamId,
            metricId : metricId,
            value : Number(event.target.value)
        })
        
        await getMarks();

        
    };

    const openDialog = async ()  => {
        setOpen(true)
        await getMarks();
    }

    const closeDialog = async ()  => {
        setOpen(false)
        await fetchMark();
    }

    const getMarks = async ()  => {

        const data = await api.getTeamTaskMetricValue(postId, userId)
        setMetricsValues(data)

    }

    return(
        <>
             <p className='baseP' onClick={openDialog} style={{cursor : "pointer"}}> <b> Оценка:</b> {mark}  </p>
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

                            
                            <button className={styles.button} type="button"  onClick={closeDialog} >
                                Назад
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default OrderP2TeamTaskDialog;