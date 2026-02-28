import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
const DeleteChannel: React.FC = ()  => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const dispatch: any = useDispatch()
    const selectedChannel = useTypedSelector(state => state.channels.selectedChannel); 
    
    const DeleteChannel = async () =>{
            await api.DeleteChannel(selectedChannel!.id)
            setOpen(false)
            dispatch(GetChannelsThunk())
        }

    



    return(
        <>
            <button  className="roundBtn" onClick={() => setOpen(true)}>
                -
            </button>

            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Удалить курс?</p>
                        
        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={DeleteChannel} >
                                Удалить 
                            </button>
                            
                            <button className={styles.button} type="button"  onClick={() => setOpen(false)} >
                                Отмена
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default DeleteChannel;