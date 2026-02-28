import React, { useEffect, useState } from 'react';
import '../css/mainPage.css'
import styles from '../css/login.module.css'
import { useTypedSelector } from '../store';
import { useDispatch } from 'react-redux';
import { api } from '../API/api';
import {GetChannelsThunk, GetUsersThunk, SetSelectedChannelActionCreator} from '../reducers/channel-reducer'


const UsersChannelInfo: React.FC = () => {
    const channelId = useTypedSelector(state => state.channels.selectedChannel!.id); 
    const channelUsers = useTypedSelector(state => state.channels.selectedChannelUsers); 
    const dispatch: any = useDispatch()

    useEffect(() => {
        dispatch(GetUsersThunk(channelId))
    }, [])



    return (
        
        <>
            {channelUsers.map((user) => (
                <div key={user.id} className='simpleForm' style={{cursor : "pointer"}} >
                    <p className='headline'> {user.email} </p>
                    <p className='headline'> {user.surname} {user.name}</p>
                </div>
                ))}
        </>
    );
};

export default UsersChannelInfo