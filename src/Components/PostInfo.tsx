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
                    <p className='headline'>{PostTypeTranslations[postState.type]}: {postState.label} </p>
                    <p className='baseP'>Сдать до {postState.deadline}</p>

                    <p> {postState.text}</p>


                </div>



                
            </>
    
        </div>

    );
};

export default PostInfo