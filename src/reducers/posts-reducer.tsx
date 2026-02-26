import { Dispatch } from "redux";
import { Post, PostShort, PostType } from "../types"
import { api } from "../API/api";


type PostsState = {
    posts: PostShort[]
    selectedPost: Post | null
}

const initialState: PostsState ={
    posts: [],
    selectedPost: null
}
export type PostsActions = GetPostsAction | GetSelectedPostAction;
export const GET_POSTS = 'GET_POSTS'; 
export const GET_SELECTED_POST = 'GET_SELECTED_POST'; 

interface GetPostsAction {
    type: typeof GET_POSTS,
    payload: PostShort[]
}
interface GetSelectedPostAction {
    type: typeof GET_SELECTED_POST,
    payload: Post | null
}

export const postsReducer = (
    state: PostsState = initialState,
    action: PostsActions
): PostsState =>{
    switch (action.type) {
    case GET_POSTS:
        return {
            ...state,
            posts : action.payload,
        };
    case GET_SELECTED_POST:
        return {
            ...state,
            selectedPost : action.payload,
        };
    default:
        return state;
    }
}

export const GetPostsThunk =  (channelId: string) =>{
    return async (dispatch: Dispatch<PostsActions>)  =>  {

        const data = await api.GetPosts(channelId);
        dispatch(GetPostsActionActionCreator(data as PostShort[])); 
    }
}

export const GetPostByIdThunk =  (postId: string) =>{
    return async (dispatch: Dispatch<PostsActions>)  =>  {

        const data = await api.GetPost(postId);
        dispatch(GetSelectedPostActionActionCreator(data as Post)); 
    }
}

export const GetSelectedPostActionActionCreator = (post: Post | null): GetSelectedPostAction => ({
      type: GET_SELECTED_POST,
      payload: post
});

export const GetPostsActionActionCreator = (posts: PostShort[]): GetPostsAction => ({
      type: GET_POSTS,
      payload: posts
});

export default postsReducer;