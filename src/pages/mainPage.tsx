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
const MainPage: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const dispatch: any = useDispatch()

    useEffect(() => {
        dispatch(GetChannelsThunk())
    }, [])



    return (
        
    <div className="app-container">
        
        <header className='header'>
           <p className='mainName'> Автошкола</p>
           <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px"}}>
                <div className='course-block'> Пользователи</div>
           </div>
        </header>
        

        

        <div className={`main-content`}>
            
            <div className='containerRow'>

                    <Cources/>

                    <ChannelInfo/>

                    
            </div>

        </div>

    </div>

    );
};

export default MainPage