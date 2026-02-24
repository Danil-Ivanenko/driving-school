import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import styles from '../css/login.module.css'

const Courses: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const dispatch: any = useDispatch()
    const [isOpen, setOpen] = useState<boolean>(false);
    const [newCorseName, setNewCorseName] = useState<string>('');
    const closeDialog = () => {
        setOpen(false)
    };

    const handleCourseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCorseName(event.target.value); 
    };
    const CreaeNewCorse =() =>{

    }
    
    useEffect(() => {
        dispatch(GetChannelsThunk())
    }, [])

    return(
        <div className='containerCol' style={{maxWidth: "500px", maxHeight: '100vh',  overflowY: 'auto'}}>

            <div className='simpleForm' style={{gap : "10px"}}>
                
                <div style={{display : "flex", justifyContent : "space-between"}}>
                    <p style={{display: "grid", placeItems : "center", fontSize:"22x",margin : "0px"}}>Курсы</p>
                    <button  style={{borderRadius :"50%" , width :"30px", height :"30px"}} onClick={() => setOpen(true)}>
                        +
                    </button>
                </div>
                
                


                    <>
                        {channelState.channels.map((channel) => (
                            <div key={channel.id} className="course-block" onClick={() => dispatch(SetSelectedChannelActionCreator(channel.id))} style={channelState.selectedChannelId == channel.id ? {backgroundColor: "#b5d7ed"} : {}}>
                                {channel.name}
                            </div>
                        ))}
                    </>
            </div>

            <div className='centerpoint' style={{display : isOpen ? 'flex' :  "none"}}>

                <dialog >  
                    <p  style={{fontSize :"20px", margin :"0px"}} >Создать курс</p>
                    <div>
                        <label htmlFor="course-input" >Введите название курса</label>
                        <input id="course-input" value={newCorseName}  onChange={handleCourseNameChange}/>
                    </div>

    
                    <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                        <button className={styles.button} type="button" >
                            Создать 
                        </button>
                        
                        <button className={styles.button} type="button" onClick={() => closeDialog()} >
                            Отмена
                        </button>
                    </div>
    
                </dialog>
            </div>

        </div>
    );
}

export default Courses;