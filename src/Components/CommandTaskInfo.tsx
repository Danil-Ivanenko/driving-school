import React, { useEffect, useState } from 'react';

import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import {  Post, PostType, PostTypeTranslations, Task } from '../types';

import DeletePostDialog from './Dialogs/DeletePostDialog';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../RoleChecker';
import CreatePostDialog from './Dialogs/CreatePostDialog';
import SendTaskDialog from './Dialogs/SendTaskDialog';
import { GetCommentsByPostIdThunk, GetSolutionsByPostIdThunk } from '../reducers/posts-reducer';
import OrderSolutionDialog from './Dialogs/OrderSolutionDialog';
import PostComment from './Dialogs/PostComment';
import TeamInfo from './Dialogs/TeamInfo';
import CreateTeamDialog from './Dialogs/CreateTeamDialog';


const CommandTaskInfo: React.FC = () => {
    //const [commentText, setCommentText] = useState<string>('');
    const postState = useTypedSelector(state => state.posts.selectedPost!) as Task; 



    
    // const handleCommentTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setCommentText(event.target.value); 
    // };
    // const SendNewComment = async () =>{
    //     if(commentText.length > 0)
    //     {
    //         await api.SendComment(postState.id, commentText)
    //         setCommentText("")
    //         dispatch(GetCommentsByPostIdThunk(postState.id))
    //     }

    // }
    

    return (
        
        <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

    
            
                <div className='simpleForm' style={{ justifyContent :"space-between"}} >
                    <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <p className='headline'>Командное задание: {postState.label} </p>
                        
                        <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                            {/* {hasAnyRole([STUDENT]) &&  < /> } здесь отправдять решения */}
                            {hasAnyRole([MANAGER,TEACHER]) && <DeletePostDialog/> }
                        </div>
                    </div>
                    
                    {postState?.documents[0]?.fileName != null && postState?.documents[0]?.fileUrl != null &&
                     (<p className='headline' onClick={() => window.location.href = postState.documents[0].fileName} style={{cursor : "pointer"}}> Файл: {postState.documents[0].fileUrl} </p>)
                    }

                    
                    {postState.votingDeadline != null && (
                        <p className='baseP'>Сдать до {postState.votingDeadline}</p>
                    )}


                    <p> {postState.text}</p>
                    <p className='baseP'>Тип команд: {postState.teamType}</p>
                    <p className='baseP'>Тип сдачи: {postState.type}</p>
                    <p className='baseP'>Перегруппировка: {postState.isCanRedistribute ? "+" : "-"}</p>
                    <p className='baseP'>Минимальное кол-во членов команды: {postState.minTeamSize}</p>
                    {postState.qualifiedMin != null && (
                        <p className='baseP'>Кол-во квалификации: {postState.qualifiedMin}</p>
                    )}
                    <br></br>
                    {hasAnyRole([MANAGER,TEACHER]) && <p className='headline'>Создать команду:  < CreateTeamDialog taskId={postState.id} /></p> }
                    
                    
                </div>
                
                
                        
                            
                        
                        {postState.teams.map((team) => (
                            <div className='simpleForm' key={team.id}>  
                                <TeamInfo team={team} />
                                </div>
                        ))}



               
                {/* <div className='simpleForm'>  
                        <div style={{display : "flex", justifyContent: "space-between"}}>
                            <p className='headline'>  Комментарии: {comments.length } </p>
                        </div>
                        
                        <div >
                            <label htmlFor="comment-name" >Оставить комменатрий</label>
                            <input id="comment-name" value={commentText} onChange={handleCommentTextChange}  />
                            <button className={styles.button} style={{marginTop : "5px"}} onClick={SendNewComment} >Отправить</button>
                        </div>

                        { 
                            
                            comments.map((comment) => (
                                <PostComment comment={comment} key={comment.id} />
                            ))

                        }

                </div> */}

                



                
                {/* {hasAnyRole([MANAGER,TEACHER])  &&(

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

                )} */}


                
           
    
        </div>

    );
};

export default CommandTaskInfo