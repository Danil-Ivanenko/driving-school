import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import DeleteChannel from './Dialogs/DeleteChannelDialog'
import CreatePostDialog from "./Dialogs/CreatePostDialog";
import { GetPostByIdThunk, GetPostsThunk, GetSelectedPostActionActionCreator } from "../reducers/posts-reducer";
import { PostTypeTranslations } from "../types";
import { hasAnyRole, MANAGER, TEACHER } from "../RoleChecker";
const ChannelInfo: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const postsState = useTypedSelector(state => state.posts);
    const dispatch: any = useDispatch()
    
    useEffect(() => {
        if(channelState.selectedChannel?.id != null)
        {
            dispatch(GetPostsThunk(channelState.selectedChannel!.id))
        }
    }, [channelState.selectedChannel?.id])
    
    const handlePostClick = async (postId : string) =>{
        dispatch(GetPostByIdThunk(postId))
    }
    if(channelState.selectedChannel?.id == null)
    {
        return null;
    }

    return(

            
        <>
            {hasAnyRole([MANAGER, TEACHER]) && (
                
                    < CreatePostDialog/>
                
            )}

            
            <>
                {postsState.posts.map((post) => (
                    <div key={post.id} className='simpleForm' style={{cursor : "pointer"}} onClick={() => handlePostClick(post.id)} >
                        <p className='headline'> {PostTypeTranslations[post.type]}: {post.label}</p>
                        <hr className="hr" />
                        <p style={{margin: "0px"}}> Комментарии: _</p>
                    </div>
                    ))}
            </>
            
        </>
                
            
    );
}

export default ChannelInfo;