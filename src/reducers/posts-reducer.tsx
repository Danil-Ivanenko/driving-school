import { Dispatch } from "redux";
import { CommentDTO, ErrorResponse, Post, PostShort, PostType, StudentSolution, Task, Team } from "../types"
import { api } from "../API/api";
import axios from "axios";


type PostsState = {
    posts: PostShort[]
    selectedPost: Post | Task |  null
    solutions: StudentSolution[]
    comments: CommentDTO[]
}

const initialState: PostsState ={
    posts: [],
    selectedPost: null,
    solutions: [],
    comments : []
}
export type PostsActions = GetPostsAction | GetSelectedPostAction | GetSolutionsAction | GetCommentsAction;
export const GET_POSTS = 'GET_POSTS'; 
export const GET_SELECTED_POST = 'GET_SELECTED_POST'; 
export const GET_SOLUTIONS = 'GET_SOLUTIONS'; 
export const GET_COMMENTS = 'GET_COMMENTS'; 

interface GetCommentsAction {
    type: typeof GET_COMMENTS,
    payload: CommentDTO[]
}

interface GetSolutionsAction {
    type: typeof GET_SOLUTIONS,
    payload: StudentSolution[]
}
interface GetPostsAction {
    type: typeof GET_POSTS,
    payload: PostShort[]
}
interface GetSelectedPostAction {
    type: typeof GET_SELECTED_POST,
    payload: Post |  Task | null
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
    case GET_SOLUTIONS:
        return {
          ...state,
          solutions : action.payload  
        };
    case GET_COMMENTS:
        return{
            ...state,
            comments : action.payload
        }
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

export const DeletePostsThunk =  (postId: string) =>{
    return async (dispatch: Dispatch<PostsActions>)  =>  {

        await api.DeletePost(postId);
        dispatch(GetSelectedPostActionActionCreator(null)); 
    }
}

export const GetPostByIdThunk =  (postId: string , type : PostType) =>{
    return async (dispatch: Dispatch<PostsActions>)  =>  {
        if(type == PostType.TEAM_TASK)
        {
            const teamTask = await api.GetTeamTask(postId);
            dispatch(GetSelectedPostActionActionCreator(teamTask as Task)); 
        }
        else
        {
            const post = await api.GetPost(postId);
            dispatch(GetSelectedPostActionActionCreator(post as Post)); 
        }
        
    }
}

export const GetSolutionsByPostIdThunk =  (postId: string) =>{
    return async (dispatch: Dispatch<PostsActions>)  =>  {

        const data = await api.GetPostSolutions(postId);
        dispatch(GetSolutionsActionCreator(data as StudentSolution[])); 
    }
}


export const GetCommentsByPostIdThunk =  (postId: string) =>{
    return async (dispatch: Dispatch<PostsActions>)  =>  {

        const data = await api.GetCommentsOfPost(postId);
        dispatch(GetCommentsActionActionCreator(data as CommentDTO[])); 
    }
}


export const GetSelectedPostActionActionCreator = (post: Post |   Task | null): GetSelectedPostAction => ({
      type: GET_SELECTED_POST,
      payload: post
});

export const GetSolutionsActionCreator = (solutions: StudentSolution[]): GetSolutionsAction => ({
      type: GET_SOLUTIONS,
      payload: solutions
});


export const GetPostsActionActionCreator = (posts: PostShort[]): GetPostsAction => ({
      type: GET_POSTS,
      payload: posts
});

export const GetCommentsActionActionCreator = (comments: CommentDTO[]): GetCommentsAction => ({
      type: GET_COMMENTS,
      payload: comments
});

export default postsReducer;