import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import CreateCourseDialog from './CreateCourseDialog'
const Courses: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const dispatch: any = useDispatch()

    
    useEffect(() => {
        dispatch(GetChannelsThunk())
    }, [])

    return(
        <div className='containerCol' style={{maxWidth: "500px", maxHeight: '100vh',  overflowY: 'auto'}}>

            <div className='simpleForm' style={{gap : "10px"}}>
                
                <div style={{display : "flex", justifyContent : "space-between"}}>
                    <p style={{display: "grid", placeItems : "center", fontSize:"22x",margin : "0px"}}>Курсы</p>

                    <CreateCourseDialog/>
                </div>
                
                <>
                    {channelState.channels.map((channel) => (
                        <div key={channel.id} className="course-block" onClick={() => dispatch(SetSelectedChannelActionCreator(channel))} style={channelState.selectedChannel?.id == channel.id ? {backgroundColor: "#b5d7ed"} : {}}>
                            {channel.name}
                        </div>
                    ))}
                </>
            </div>
            

        </div>
    );
}

export default Courses;