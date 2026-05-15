import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetSolutionsByPostIdThunk } from "../../reducers/posts-reducer";
import { ErrorResponse, MetricTranslations, MetricWithValuesDto } from "../../types";
import axios from "axios";
const OrderSolutionDialog: React.FC<{ userId: number}> = ({ userId}) => {
    const [isOpen, setOpen] = useState<boolean>(false);


    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const [metricsValues, setMetricsValues] = useState<MetricWithValuesDto[]>([]);
    const [mark , setMark] = useState<number>(0);
    useEffect(() => {
        fetchMark();
    }, []);
    
    const fetchMark = async () => {
        const data = await api.getPostMarkByUserId(postState.id, userId);
        setMark(data?.value ?? 0); 
    };
    
    const handleMarkInputChange = async (event: React.ChangeEvent<HTMLInputElement> , metricId : string) => {
        const data = await api.changeMetricToUser({
            metricId : metricId,
            userId : userId,
            value : Number(event.target.value)
        })

        
            const metricValues = await api.getPostMetricValue(postState.id, userId)
            setMetricsValues(metricValues)
            
            fetchMark();
        
    };

    const openDialog = async ()  => {
        setOpen(true)
        const metricValues = await api.getPostMetricValue(postState.id, userId)
        setMetricsValues(metricValues)
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

export default OrderSolutionDialog;