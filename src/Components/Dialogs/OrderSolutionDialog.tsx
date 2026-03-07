import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetSolutionsByPostIdThunk } from "../../reducers/posts-reducer";
const OrderSolutionDialog: React.FC<{ solId: string, mark? : number}> = ({ solId, mark}) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const dispatch: any = useDispatch()
    const selectedChannel = useTypedSelector(state => state.channels.selectedChannel); 
    const [markInput, setMarkInput] = useState<number>(mark || 0);
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const OrderSolution= async () =>{
            await api.OrderSolution(solId, markInput)
            setOpen(false)
             dispatch(GetSolutionsByPostIdThunk(postState.id))
        }

const handleMarkInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(event.target.value);
    if (!isNaN(value)) 
    {
        if (value < 1) { value = 1;} 
        else if (value > 5) {value = 5;}
        setMarkInput(value);
    } 
    else 
    {
        setMarkInput(1); 
    }
};



    return(
        <>
             <p className='baseP' onClick={() => setOpen(true)} style={{cursor : "pointer"}}> <b> Оценка:</b> {mark || "Оценить"} </p>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Оценить</p>
                        
                        <div>
                            <label htmlFor="mark" >Оценка</label>
                            <input id="mark" type="number" value={markInput}  min="1" max="5" step="1" onChange={handleMarkInputChange}/>
                        </div>

                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={OrderSolution} >
                                Сохранить 
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

export default OrderSolutionDialog;