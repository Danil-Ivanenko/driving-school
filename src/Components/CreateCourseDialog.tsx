import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import styles from '../css/login.module.css'
import { api } from "../API/api";
const CreateCourseDialog: React.FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [newCorseName, setNewCorseName] = useState<string>('');
    const dispatch: any = useDispatch()
    const [error, setError] = useState<string>('');


    const closeDialog = () => {
        setOpen(false)
    };

    const handleCourseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCorseName(event.target.value); 
        setError('')
    };
    const CreaeNewCorse = async () =>{
        if(newCorseName.length < 5)
        {
            setError("Название не меншье 5 символов")
        }
        else
        {
            await api.CreateChannel(newCorseName)
            setNewCorseName("")
            setOpen(false)
            dispatch(GetChannelsThunk())
        }

    }


    return(
        <>
            <button  className="roundBtn" onClick={() => setOpen(true)}>
                +
            </button>

            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Создать курс</p>
                        
                        <div>
                            <label htmlFor="course-input" >Введите название курса</label>
                            <input id="course-input" value={newCorseName}  onChange={handleCourseNameChange}/>
                        </div>
                        
                        <b className={styles['error']} >{error}</b>
        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={CreaeNewCorse} >
                                Создать 
                            </button>
                            
                            <button className={styles.button} type="button" onClick={() => closeDialog()} >
                                Отмена
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default CreateCourseDialog;