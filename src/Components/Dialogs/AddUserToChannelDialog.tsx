import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, GetUsersThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { PostType, UserProfile } from "../../types";
import { GetPostsThunk } from "../../reducers/posts-reducer";

const AddUserToChannelDialog: React.FC = ()  => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const channelUsers = useTypedSelector(state => state.channels.selectedChannelUsers); 
    const channel = useTypedSelector(state => state.channels.selectedChannel); 
    const channelUserIds = new Set(channelUsers?.map(user => user.id) || []);
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const dispatch: any = useDispatch()
     useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);
    const handAddUserToChanngel = async (userId :number) => {
        await api.AddUserToChannel(userId, channel!.id )
        dispatch(GetUsersThunk(channel!.id)) 
    }

    const loadUsers = async () => {
        const users = await api.GetActiveStudentUsers();
        setAllUsers(users as UserProfile[]);

    };
    const availableUsers = allUsers.filter(user => !channelUserIds.has(user.id));

    return(
        <>
            <div className='simpleForm' >
                <div className='course-block' onClick={() => setOpen(true)}> Добавить пользователя</div>
                {isOpen && (
                    <div className="modalOverlay" >
                        <dialog  className='centerpointModal'   >
                            <div  style={{overflowY :"auto" , height : "310px"}}>
                            <p  style={{fontSize :"20px", margin :"0px"}} >Добавить пользователя</p>
                            
                                {availableUsers.map((user) => (
                                    <div key={user.id}  className='simpleForm' style={{cursor : "pointer"}} onClick={() => handAddUserToChanngel(user.id)} >
                                        <p className='headline'> {user.email} </p>
                                        <p className='headline'> {user.lastName} {user.firstName}</p>
                                    </div>
                                ))}
       

                            </div>  
                            <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >                           
                                <button className={styles.button} type="button" onClick={() => setOpen(false)} >
                                    Отмена
                                </button>
                            </div>
                        
                    </dialog>
                    </div>
                )}
            </div>
            
        </>
        
    );
}

export default AddUserToChannelDialog;