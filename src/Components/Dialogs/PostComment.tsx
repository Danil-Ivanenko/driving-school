import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetCommentsByPostIdThunk, GetSolutionsByPostIdThunk } from "../../reducers/posts-reducer";
import { CommentDTO } from "../../types";
const PostComment: React.FC<{ comment: CommentDTO}> = ({ comment}) => {
    const postState = useTypedSelector(state => state.posts.selectedPost!); 
    const [isOpen, setOpen] = useState<boolean>(false);
    const [chnageCommnet, setChangeCommetn] = useState<string>(comment.text); 
    const dispatch: any = useDispatch()
    const handleChangeCommentTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChangeCommetn(event.target.value); 
    };
    
    const openDialog = () => {
        const userId = localStorage.getItem("id")
        if (Number(userId) == comment.authorDto.id)
        {
            setOpen(true)
        }
    };

    const ChangeComment = async () =>{
        if(chnageCommnet.length > 0)
        {
            await api.ChangeComment(comment.id, chnageCommnet)
            dispatch(GetCommentsByPostIdThunk(postState.id))
            setOpen(false)
        }

    }
    
    const DeleteComment = async () =>{
            await api.DeleteComment(comment.id)
            dispatch(GetCommentsByPostIdThunk(postState.id))
        
    }
    return(
        <>
            <div  style={{marginTop : "10px"}} onClick={openDialog}   >
                <p className='baseP'> <b> Пользователь:</b> {comment.authorDto.lastName}  {comment.authorDto.firstName}</p>
                <p className='baseP'>   {comment.text}</p>
                <hr className="hr" />
            </div>

            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Комментарий</p>
                        
                        <div>
                            <input id="commnet"  value={chnageCommnet}  onChange={handleChangeCommentTextChange}/>
                        </div>

                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={ChangeComment} >
                                Сохранить 
                            </button>
                            
                            <button className={styles.button} type="button" onClick={DeleteComment} >
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

export default PostComment;