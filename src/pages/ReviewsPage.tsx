
import React, { useEffect, useState } from 'react';

import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import { PostTypeTranslations, ReviewStatus, ReviewStatusTranslation, ReviewTasksDto, Task } from '../types';

import HeaderComponent from '../Components/HeaderComponent';
import OrderSolutionDialog from '../Components/Dialogs/OrderSolutionDialog';
import OrderP2PostDialog from '../Components/Dialogs/OrderP2PostDialog';

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

    return (
        
    <div className="app-container">
        
        <HeaderComponent />

        

        <div className={`main-content`}>
            
            <div className='containerRow' style={{gridTemplateColumns :"auto"}}>

                    <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>
                        
                        {reviews?.personal.map((task) => (
                            <div className='simpleForm' style={{ justifyContent :"space-between"}} key={task.targetSolutionId} >
                                <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                                    <p className='headline'>{PostTypeTranslations[task.post.type]}: {task.post.label} </p>

                                </div>
                                <p> {task.post.text}</p>
                                {task.post.fileName != null && task.post.fileUrl != null &&
                                    (<p className='headline' onClick={() => window.location.href = task.post.fileUrl!} style={{cursor : "pointer"}}> Файл: {task.post.fileName} </p>)
                                }
                                
                                {task.post?.studentSolution != null &&
                                    (
                                        <>
                                            <p> Ответ: {task.post.studentSolution.text}</p>
                                            {task.post.studentSolution.fileUrl != null && 
                                                <p onClick={() => window.location.href = task.post.studentSolution!.fileUrl!} style={{cursor : "pointer"}}> Файл: {task.post.studentSolution.fileName}</p>
                                            }
                                            </>
                                    )
                                }
                               
                                {task?.owner != null && (
                                    <p>Сдал : {task.owner.surname} {task.owner.name}</p>
                                )}
                                <p>Статус провреки: {ReviewStatusTranslation[task.status]}</p>
                                {task.status != ReviewStatus.EXPIRED && (
                                    < OrderP2PostDialog userId={task.owner.id} postId={task.post.id}   /> 
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