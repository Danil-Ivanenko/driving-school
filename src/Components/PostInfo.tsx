import React, { useEffect, useState } from 'react';
import '../css/mainPage.css'
import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'
import { Channel, PostTypeTranslations } from '../types';
import { Dispatch } from 'redux';
import Cources from './Courses'
import ChannelInfo from './ChannelInfo'
import DeletePostDialog from './Dialogs/DeletePostDialog';
import { hasAnyRole, MANAGER, STUDENT, TEACHER } from '../RoleChecker';
const PostInfo: React.FC = () => {
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const dispatch: any = useDispatch()

    useEffect(() => {
        dispatch(GetChannelsThunk())
    }, [])



    return (
        
        <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

    
            <>
                <div className='simpleForm' style={{ justifyContent :"space-between"}} >
                    <div style={{display: "flex",justifyContent : "space-between",  gap:"5px", alignItems: "center"}}>
                        <p className='headline'>{PostTypeTranslations[postState.type]}: {postState.label} </p>
                        {hasAnyRole([MANAGER,TEACHER]) && <DeletePostDialog/> }
                    </div>
                    {postState.deadline != null && (
                        <p className='baseP'>Сдать до {postState.deadline}</p>
                    )}
                    

                    <p> {postState.text}</p>

                    <hr className="hr" />
                    <p style={{margin: "0px"}}> Комментарии: _</p>
                </div>



                
            </>
    
        </div>

    );
};

export default PostInfo