import React, { useEffect, useState } from 'react';
import '../css/mainPage.css'
import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import { Channel } from '../types';
import { Dispatch } from 'redux';
import Cources from '../Components/Courses'
import ChannelInfo from '../Components/ChannelInfo'
import PostInfo from '../Components/PostInfo';
import DeleteChannel from '../Components/Dialogs/DeleteChannelDialog';
import UsersChannelInfo from '../Components/UsersChannelInfo';
import { hasAnyRole, MANAGER, TEACHER } from '../RoleChecker';
import { GetMyProfileThunk } from '../reducers/myProfile-reducer';
const MainPage: React.FC = () => {
    const [isCourseOpen, setCourseOpen] = useState<boolean>(true)
    const [isUsersOpen, setUsersOpen] = useState<boolean>(false)
    
    const openCourse =  () =>{
            setCourseOpen(true)
            setUsersOpen(false)
        }

    const openUsers =  () =>{
            setCourseOpen(false)
            setUsersOpen(true)
    }



    const channelState = useTypedSelector(state => state.channels); 
    const dispatch: any = useDispatch()
    const post = useTypedSelector(state => state.posts);
    const myProfile = useTypedSelector(state => state.myProfile);
    useEffect(() => {
        dispatch(GetChannelsThunk())
        dispatch(GetMyProfileThunk())
    }, [])

    const signOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userRoles')
        window.location.href = "/login"
    };

    return (
        
    <div className="app-container">
        
        <header className='header'>
           <p className='mainName'> Автошкола</p>
           
           
            <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px"}}>
                {hasAnyRole([MANAGER, TEACHER]) && (<div className='course-block'> Пользователи</div>)}
                <div onClick={signOut} className='course-block'> {myProfile.profile?.lastName} { myProfile.profile?.firstName } ↩</div>
            </div>
           

        </header>

        

        <div className={`main-content`}>
            
            <div className='containerRow'>

                    <Cources/>
                    <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

                    
                        {channelState.selectedChannel != null && (
                            <div className='simpleForm' style={{flexDirection :"row" ,justifyContent :"space-between"}}>
                                <p className='headline'> {channelState.selectedChannel.name} </p>
                                
                                {hasAnyRole([MANAGER, TEACHER]) && (
                                <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                                    <div className='course-block' style={ isCourseOpen ? {backgroundColor: "#b5d7ed"} : {}} onClick={openCourse}> Курс</div>
                                    <div className='course-block' style={ isUsersOpen ? {backgroundColor: "#b5d7ed"} : {}} onClick={openUsers}>  Пользователи</div>
                                    
                                    <DeleteChannel/>
                                </div>
                                )}

                                
                            </div>
                        )}
                    
                        {isCourseOpen && (

                            post.selectedPost == null ? (
                                <ChannelInfo/> 
                            ): (
                                <PostInfo/>
                            )
                        
                        )}
                        
                        {isUsersOpen && (
                            <UsersChannelInfo/>
                        )}

                    </div>


            </div>

        </div>

    </div>

    );
};

export default MainPage