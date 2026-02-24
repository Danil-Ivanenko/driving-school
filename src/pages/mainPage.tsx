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

                    <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>
                    
                        <div className='simpleForm'>
                            <p> СОздать </p>
                            <textarea style={{maxWidth : "100%", minWidth : "100%"}} >
                               Какой-то текст
                            </textarea>

                        </div>


                            <div className='simpleForm'>
                                <p> Типо карточка</p>

                            <hr className="hr" />
                        </div>
                    </div>

                    
            </div>

        </div>

    </div>

    );
};

export default MainPage