import React, { useEffect, useState } from 'react';
import '../css/mainPage.css'
import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import { Channel, PostType, PostTypeTranslations } from '../types';
import { Dispatch } from 'redux';
import Cources from './Courses'
import ChannelInfo from './ChannelInfo'
import DeletePostDialog from './Dialogs/DeletePostDialog';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../RoleChecker';
import CreatePostDialog from './Dialogs/CreatePostDialog';
import SendTaskDialog from './Dialogs/SendTaskDialog';
import { GetSolutionsByPostIdThunk } from '../reducers/posts-reducer';
import OrderSolutionDialog from './Dialogs/OrderSolutionDialog';
const PostInfo: React.FC = () => {
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const dispatch: any = useDispatch()
    const solutions = useTypedSelector(state => state.posts.solutions)
    useEffect(() => {
        dispatch(GetChannelsThunk())
        dispatch(GetSolutionsByPostIdThunk(postState.id))
    }, [])

    return (
        
        <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

    
            
                <div className='simpleForm' style={{ justifyContent :"space-between"}} >
                    <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <p className='headline'>{PostTypeTranslations[postState.type]}: {postState.label} </p>
                        <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                            {hasAnyRole([STUDENT]) && < SendTaskDialog/> }
                            {hasAnyRole([MANAGER,TEACHER]) && <DeletePostDialog/> }
                        </div>
                    </div>
                    
                    {postState.fileName != null && postState.fileUrl != null &&
                     (<p className='headline' onClick={() => window.location.href = postState.fileUrl!} style={{cursor : "pointer"}}> Файл: {postState.fileName} </p>)
                    }

                    
                    {postState.deadline != null && (
                        <p className='baseP'>Сдать до {postState.deadline}</p>
                    )}


                    <p> {postState.text}</p>
                    <hr className="hr" />
                    <p style={{margin: "0px"}}> Комментарии: _</p>

                </div>
                
                {postState.type == PostType.TASK &&  hasAnyRole([MANAGER,TEACHER])  &&(

                    <div className='simpleForm'>  
                        <div style={{display : "flex", justifyContent: "space-between"}}>
                            <p className='headline'> Решения </p>
                        </div>

                        {solutions.map((sol) => (

                            <div key={sol.id} style={{marginTop : "10px"}}   >
                                 <p className='baseP'> <b> Пользователь:</b>  {sol.studentName}</p>
                                 <p className='baseP'> <b> Текст:</b>  {sol.text}</p>
                                 {sol.fileUrl !== null && ( <p className='baseP' style={{cursor : "pointer"}} onClick={() => window.location.href = sol.fileUrl!} > <b> Файл:</b>   {sol.fileName}</p> )}
                                
                                < OrderSolutionDialog solId={sol.id} mark={sol.mark}/>
                                <hr className="hr" />
                            </div>
                            
                        ))}
                    </div>

                )}


                
           
    
        </div>

    );
};

export default PostInfo