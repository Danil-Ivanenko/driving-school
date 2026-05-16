import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";

import { CreateMetricDTO, ErrorResponse, MetricDTO, MetricTranslations, MetricType, Post, PostType, Task } from "../../types";
import axios from "axios";
const MetricsDialog: React.FC<{ id: string, postType: PostType}> = ({ id, postType}) => {

    const [isOpen, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [metrics, setMetrics] = useState<MetricDTO[]>([]);
    
    const [newMetric, setNewMetric] = useState<CreateMetricDTO>({
        name: '',
        comment: '',
        minValue: 0,
        maxValue: 0,
        type: MetricType.MARK,
        postId: postType != PostType.TEAM_TASK ? id : null,
        taskId: postType == PostType.TEAM_TASK ? id : null,
        isValuesVisibleToStudents :true,
        isVisibleToStudents : true
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMetric(prev => ({
        ...prev,
        [name]: name === 'minValue' || name === 'maxValue' ? Number(value) : value,
        }));
        setError('')
    };

    
    const addMetric = async () => {

        const data  = await api.AddMetric(newMetric )
        if(axios.isAxiosError<ErrorResponse>(data))
        {
            setError(data.response?.data.message || "")
        }
        else
        {
            await getMetrics()
            setNewMetric({
                name: '',
                comment: '',
                minValue: 0,
                maxValue: 0,
                type: MetricType.MARK,
                postId: postType != PostType.TEAM_TASK ? id : null,
                taskId: postType == PostType.TEAM_TASK ? id : null,
                isValuesVisibleToStudents :true,
                isVisibleToStudents : true
            });
        }
    }

    const deleteMetric = async (idToDelete : string) => {

        await api.deleteMetric(idToDelete)
        const data = await api.getMetric(id , postType);
        setMetrics(data);
    }

    const openDialog = async () => {
        setOpen(true)
        await getMetrics()
    }

    const getMetrics = async () => {
        const data = await api.getMetric(id , postType);
        setMetrics(data);
    }
    return(
        <>
        <p className='course-block' onClick={openDialog} style={{cursor : "pointer"}}>  Критерии </p>

        {isOpen && (
        <div className="modalOverlay" >
          <dialog className='centerpointModal' style={{ maxHeight: "600px", overflowY: "auto",}}>
              
                <p className="baseHeader">Управление критериями</p>
                
                <div style={{ marginBottom: '10px' }}>
                  <label>Название: *</label>
                  <input
                    type="text"
                    name="name"
                    value={newMetric.name}
                    onChange={handleInputChange}
                    placeholder="Введите название метрики"
            
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label>Комментарий:</label>
                  <textarea
                    name="comment"
                    value={newMetric.comment}
                    onChange={handleInputChange}
                    placeholder="Описание метрики"
                    style={{ maxWidth :"100%"}}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Минимальное значение:</label>
                    <input
                      type="number"
                      name="minValue"
                      value={newMetric.minValue}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Максимальное значение:</label>
                    <input
                      type="number"
                      name="maxValue"
                      value={newMetric.maxValue}
                      onChange={handleInputChange}
                     
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label>Тип:</label>
                  <select
                    name="type"
                    value={newMetric.type}
                    onChange={handleInputChange}
                  >
                    {Object.values(MetricType).map((type) => (
                            <option key={type} value={type}>
                                {MetricTranslations[type]}
                            </option>
                    ))}
                  </select>
                </div>
                    <b className={styles['error']} >{error}</b>
                <button 
                    onClick={addMetric}
                    className={styles.button}
                >
                  Добавить критерий
                </button>
              

              
              {metrics.length > 0 && (
                <div >
                  <p className="baseHeader">Добавленные метрики ({metrics.length})</p>
                  <div >
                    {metrics.map((metric) => (
                      <div key={metric.id} style={{ 
                        padding: '10px', 
                        marginBottom: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <strong>{metric.name}</strong>
                            {metric.comment && <p style={{ margin: '5px 0', color: '#666' }}>{metric.comment}</p>}
                            
                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>
                              Диапазон: {metric.minValue} - {metric.maxValue} | Тип: {metric.type}
                            </p>
                            
                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>
                              Комментарий: {metric.comment}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => deleteMetric(metric.id)}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginLeft: '10px'
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Кнопки действий */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button  className={styles.button}
                  onClick={() => setOpen(false)}
                >
                  Отмена
                </button>
            </div>
            
          </dialog>
        </div>
      )}
        
            
        </>
        
    );
}

export default MetricsDialog;