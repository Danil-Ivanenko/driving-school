import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { GetPostByIdThunk } from "../../reducers/posts-reducer";
import { Post, Task } from "../../types";
const SendTaskDialog: React.FC = () => {
    const postState = useTypedSelector(state => state.posts.selectedPost!) as Post; 
    const [isOpen, setOpen] = useState<boolean>(false);

    const [text, setText] = useState<string>("");
    const [file, setFile] = useState<File| null>(null);
    const [fileName, setFileName] = useState<string>( "");
    const dispatch: any = useDispatch()
    
    useEffect(() => {
        if (postState.studentSolution) 
        {
            setText(postState.studentSolution?.text || "");
            setFileName(postState.studentSolution?.fileName || "");
        }
    }, [postState]);



    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value); 
    };
    
    const RemoveFile = () => {
        setFile(null);
        setFileName("");

    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) 
        {
            setFile(files[0]);
        } 
        else 
        {
            setFile(null);
        }
    };

    const handleDeleteFile = async () => {
        await api.StudentDeleteTask(postState.studentSolution!.id ) //удаление 
        dispatch(GetPostByIdThunk(postState.id, postState.type))
        setOpen(false)
        setFile(null);
        setText("");
        setFileName("");
    }

    const handleSaveFile = async () => {
        if(postState.studentSolution == null)
        {
            await api.StudentSendTask(postState.id, text, file ) //первая отправка post
        }
        else 
        {

            await api.StudentChangeTask(postState.studentSolution.id, text, file ) //изменение put

        }
        dispatch(GetPostByIdThunk(postState.id, postState.type))
        setOpen(false)
    }



    return(
        <>
            <button  className="course-block" onClick={() => setOpen(true)}>
               {postState?.studentSolution == null ? "Ответ" : `Ваш ответ ${postState?.studentSolution?.mark || ""}` }
            </button>

            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        <p  style={{fontSize :"20px", margin :"0px"}} >Ответить</p>
                        
                        <div>
                            <label htmlFor="task-input" >Введите текст</label>
                            <input id="task-input" value={text} onChange={handleTextChange} />
                        </div>
                       
                        {fileName == "" ? 
                            (
                                <div>                    
                                    <input type="file" multiple={false} onChange={handleFileChange}  />
                                    
                                </div>
                            ) : 
                            (
                            <div>
                                <label>Файл:</label>
                                <p className="baseP" onClick={RemoveFile}> {fileName}</p>
                            </div>
                            )
                        }


        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >

                            
                            {postState.studentSolution?.mark == null && (
                                <button className={styles.button} type="button" onClick={handleSaveFile} >
                                    Сохранить 
                                </button>

                            )}

                            <button className={styles.button} type="button" onClick={() => setOpen(false)} >
                                Отмена
                            </button>
                            {postState.studentSolution != null && postState.studentSolution.mark == null && (
                                <button className={styles.button} type="button" onClick={handleDeleteFile} >
                                    Удалить 
                                </button>

                            )}

                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default SendTaskDialog;