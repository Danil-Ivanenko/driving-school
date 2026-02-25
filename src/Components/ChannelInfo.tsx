import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import DeleteChannel from './DeleteChannel'
const ChannelInfo: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const dispatch: any = useDispatch()


    return(
            <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

                {channelState.selectedChannel != null && (
                        <>
                            <div className='simpleForm' style={{flexDirection :"row" ,justifyContent :"space-between"}}>
                                <p className='headline'> {channelState.selectedChannel.name} </p>
                                
                                <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                                    <div className='course-block'> Пользователи</div>
                                    <DeleteChannel/>
                                </div>
      
                            </div>

                            <div className='simpleForm'>
                                <p> Типо карточка</p>

                                <hr className="hr" />
                            </div>
                        
                        </>
                        )}
            </div>
    );
}

export default ChannelInfo;