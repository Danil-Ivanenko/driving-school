
import React, { useEffect, useState } from 'react';

import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import { PostType, PostTypeTranslations, ReviewStatus, ReviewStatusTranslation, ReviewTasksDto, Task } from '../types';

import HeaderComponent from '../Components/HeaderComponent';
import OrderSolutionDialog from '../Components/Dialogs/OrderSolutionDialog';
import OrderP2PostDialog from '../Components/Dialogs/OrderP2PostDialog';
import OrderP2TeamTaskDialog from '../Components/Dialogs/OrderP2TeamTaskDialog';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<ReviewTasksDto>();

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        const response = await api.getP2PJobs();
        setReviews(response)
        console.log(response)
    };
    console.log(reviews)
    return (
        
    <div className="app-container">
        
        <HeaderComponent />

        

        <div className={`main-content`}>
            
            <div className='containerRow' style={{gridTemplateColumns :"auto"}}>

                    <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>
                        
                        {reviews?.personal.map((task) => (
                            <div className='simpleForm' style={{ justifyContent :"space-between"}} key={task.id} >
                                <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                                    <p className='headline'>{PostTypeTranslations[task.post.type]}: {task.post.label} </p>

                                </div>
                                <p> {task.post.text}</p>
                                {task.post.fileName != null && task.post.fileUrl != null &&
                                    (<p className='headline' onClick={() => window.location.href = task.post.fileUrl!} style={{cursor : "pointer"}}> Файл: {task.post.fileName} </p>)
                                }
                                
                                {task?.targetSolution != null &&
                                    (
                                        <>
                                            <p className='headline'> Ответ: {task?.targetSolution.text}</p>
                                            {task?.targetSolution.fileUrl != null && 
                                                <p className='headline' onClick={() => window.location.href = task?.targetSolution!.fileUrl!} style={{cursor : "pointer"}}> Файл: {task?.targetSolution.fileName}</p>
                                            }
                                            </>
                                    )
                                }
                               
                                {task?.owner != null && (
                                    <p>Сдал : {task.owner.surname} {task.owner.name}</p>
                                )}
                                <p className='baseP'>Проверить до: {task.post.p2pParam?.p2pDeadline}</p>
                                <p>Статус провреки: {ReviewStatusTranslation[task.status]}</p>
                                {task.status != ReviewStatus.EXPIRED && (
                                    < OrderP2PostDialog userId={task.owner.id} postId={task.post.id}   /> 
                                )}
                                 
                            </div>

                            
                        ))}

                        {reviews?.team.map((task) => (
                            <div className='simpleForm' style={{ justifyContent :"space-between"}} key={task.id} >
                                <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                                    <p className='headline'>{PostTypeTranslations[PostType.TEAM_TASK]}: {task.task.label} </p>

                                </div>
                                <p> {task.task.text}</p>
                                {task.task.documents[0]?.fileName != null && task.task.documents[0]?.fileUrl != null &&
                                    (<p className='headline' onClick={() => window.location.href = task.task.documents[0].fileUrl!} style={{cursor : "pointer"}}> Файл: {task.task.documents[0].fileName} </p>)
                                }
                                
                                    {task.targetTaskSolution != null && 
                                    task.targetTaskSolution.documents.map((doc, index) => (
                                        <p 
                                        key={index}
                                        className='headline' 
                                        onClick={() => window.location.href = doc.fileUrl} 
                                        style={{cursor: "pointer"}}
                                        >
                                        Файл: {doc.fileName}
                                        </p>
                                    ))
                                }
                               
                                {task?.ownerTeam != null && (
                                    <p>Сдала команда : {task.ownerTeam.name}</p>
                                )}
                                <p className='baseP'>Проверить до: {task.task.p2pParam?.p2pDeadline}</p>
                                <p>Статус провреки: {ReviewStatusTranslation[task.status]}</p>
                                {task.status != ReviewStatus.EXPIRED && (
                                    < OrderP2TeamTaskDialog userId={task.ownerTeam.users[0].id} postId={task.task.id} teamId={task.ownerTeam.id}   /> 
                                )}
                                 
                            </div>

                            
                        ))}



                    </div>


            </div>

        </div>

    </div>

    );
};

export default ReviewsPage