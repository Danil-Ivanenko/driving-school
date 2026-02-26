import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import styles from '../css/login.module.css'
import { api } from "../API/api";
import { PostType } from "../types";
import { GetPostsThunk } from "../reducers/posts-reducer";

const CreatePostDialog: React.FC = ()  => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [postName, setPostName] = useState<string>('');
    const [postText, setPostText] = useState<string>('');
    const [postType, setPostType] = useState<PostType>(PostType.NEWS);
    const [postDeadline, setPostDeadline] = useState<string>('');

    const handlePostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostName(event.target.value); 
    };
    
    const handlePostTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostText(event.target.value); 
    };

    const handlePostTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as PostType;
        setPostType(value);
    };

    const handlePostDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostDeadline(event.target.value); 
    };

    const dispatch: any = useDispatch()
    const selectedChannel = useTypedSelector(state => state.channels.selectedChannel);

    const CreatePost = async () =>{
        await api.CreatePost(postName, postText, postType, postDeadline, selectedChannel!.id)
        setOpen(false)
        setPostName('')
        setPostText('')
        setPostDeadline('')
        dispatch(GetPostsThunk(selectedChannel!.id))
    }

    return(
        <>
             <div className='course-block' onClick={() => setOpen(true)}> Создать запись</div>
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Создать запись</p>
                        
                        <div>
                            <label htmlFor="post-name" >Название записи*</label>
                            <input id="post-name" value={postName}  onChange={handlePostNameChange}/>
                        </div>
                                                
                        <div>
                            <label htmlFor="post-text" >Текст записи*</label>
                            <textarea id="post-text" style={{maxWidth: "100%", minWidth: "100%", maxHeight : "300px"}} value={postText}  onChange={handlePostTextChange}/>
                        </div>
                        
                        <div>
                            <label htmlFor="post-type" >Тип записи*</label>
                            <select value={postType} onChange={handlePostTypeChange}>
                                <option value={PostType.NEWS}>Новость</option>
                                <option value={PostType.TASK}>Задача</option>
                                <option value={PostType.LECTURE}>Лекция</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="post-deadline" >Срок </label>
                            <input id="post-deadline" type='datetime-local' value={postDeadline}  onChange={handlePostDeadlineChange}/>
                        </div>
        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            <button className={styles.button} type="button" onClick={CreatePost} >
                                Создать 
                            </button>
                            
                            <button className={styles.button} type="button" onClick={() => setOpen(false)} >
                                Отмена
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default CreatePostDialog;