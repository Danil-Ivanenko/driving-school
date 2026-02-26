import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../reducers/channel-reducer";
import DeleteChannel from './DeleteChannel'
import CreatePostDialog from "./CreatePostDialog";
import { GetPostByIdThunk, GetPostsThunk, GetSelectedPostActionActionCreator } from "../reducers/posts-reducer";
import { PostTypeTranslations } from "../types";
const ChannelInfo: React.FC = () => {
    const channelState = useTypedSelector(state => state.channels); 
    const postsState = useTypedSelector(state => state.posts);
    const dispatch: any = useDispatch()
    useEffect(() => {
        if(channelState.selectedChannel?.id != null)
        {
            dispatch(GetPostsThunk(channelState.selectedChannel!.id))
        }
        
    }, [channelState.selectedChannel])
    
    const handlePostClick = async (postId : string) =>{
        dispatch(GetPostByIdThunk(postId))
    }

    return(
            <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>

                {channelState.selectedChannel != null && (
                        <>
                            <div className='simpleForm' style={{flexDirection :"row" ,justifyContent :"space-between"}}>
                                <p className='headline'> {channelState.selectedChannel.name} </p>
                                
                                <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px", alignItems: "center"}}>
                                    <div className='course-block'> Пользователи</div>
                                    <CreatePostDialog/>
                                    <DeleteChannel/>
                                </div>
      
                            </div>


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
                )}
            </div>
    );
}

export default ChannelInfo;