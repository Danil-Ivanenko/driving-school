import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import CreateCourseDialog from './Dialogs/CreateCourseDialog'
import { GetSelectedPostActionActionCreator } from "../reducers/posts-reducer";
import { Channel } from "../types";
const Courses: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const postState = useTypedSelector(state => state.posts)
    const dispatch: any = useDispatch()

    
    useEffect(() => {
        dispatch(GetChannelsThunk())
    }, [])
    
    const handleChannelClick =  (channel : Channel) =>{
        dispatch(GetSelectedPostActionActionCreator(null)) 
        if(postState.selectedPost == null)  //из-за того что state не успел обновиться клик по любому каналу вернет пользователю предыдущий канал
        {
            dispatch(SetSelectedChannelActionCreator(channel))
        }
        
    }
    

    return(
        <div className='containerCol' style={{maxWidth: "500px", maxHeight: '100vh',  overflowY: 'auto'}}>

            <div className='simpleForm' style={{gap : "10px"}}>
                
                <div style={{display : "flex", justifyContent : "space-between"}}>
                    <p style={{display: "grid", placeItems : "center", fontSize:"22x",margin : "0px"}}>Курсы</p>

                    <CreateCourseDialog/>
                </div>
                
                <>
                    {channelState.channels.map((channel) => (
                        <div key={channel.id} className="course-block" onClick={() => handleChannelClick(channel)} style={channelState.selectedChannel?.id == channel.id ? {backgroundColor: "#b5d7ed"} : {}}>
                            {channel.name}
                        </div>
                    ))}
                </>
            </div>
            

        </div>
    );
}

export default Courses;