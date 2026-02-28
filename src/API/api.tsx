import axios, {AxiosError} from 'axios';
import { tokenResponse, ErrorResponse, Channel, PostType, PostShort, Post, MaxChannelInfoAPI } from '../types';


const baseURL ='http://localhost:8080/';
export const instance = axios.create({
    baseURL : baseURL
});


async function login(email : string, password : string){
    try
    {
        const {data, status} = await instance.post<tokenResponse>('auth/login',{
            email: email,
            password: password})

        return(data )
    }
    catch(e)
    {
        return e
    }

}
async function GetChannels()   { 
    try 
    {
        const { data, status } = await instance.get<Channel[]>('channel', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
        return data
    } 
    catch (e) 
    {
        console.error("Failed to fetch channels:", e);
    }
    
};

async function CreateChannel(name: string)   { 
    try 
    {
        const formData = new FormData();
        formData.append('name', name)
        formData.append('userIds', '')
        await instance.post('channel/create', formData,
        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
    } 
    catch (e) 
    {
        console.error( e);
    }
    
};

async function DeleteChannel(id: string)   { 
    try
    {
        await instance.delete(`channel/delete/${id}`,  {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
    })
    }
    catch(e)
    {
        return e
    }
};

async function DeletePost(id: string)   { 
    try
    {
        await instance.delete(`posts/${id}`,  {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
    })
    }
    catch(e)
    {
        return e
    }
};

async function CreatePost(label: string, text: string, type : string, deadline: string, channelId :string)   { 
    try
    {
        await instance.post(`posts`,
        {
            label: label,
            text: text,
            type: type,
            deadline: deadline,
            authorId : 1, //переделать
            needMark: type == PostType.TASK ? true : false,
            channelId: channelId
        }, 
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })
    }
    catch(e)
    {
        return e
    }
};


async function GetPosts(channelId: string)   { 
    try 
    {
        const { data, status } = await instance.get<PostShort[]>(`posts/channel/${channelId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
        return data
    } 
    catch (e) 
    {
        console.error( e);
    }
    
};
async function GetPost(postId: string)   { 
    try 
    {
        const { data, status } = await instance.get<Post>(`posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
        return data
    } 
    catch (e) 
    {
        console.error( e);
    }
    
};

async function GetChannelUsers(channelId: string)   { 
    try 
    {
        const { data, status } = await instance.get<MaxChannelInfoAPI>(`channel/${channelId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
        return data.users
    } 
    catch (e) 
    {
        console.error( e);
    }
    
};

export const api = {
    login : login,
    GetChannels : GetChannels,
    CreateChannel: CreateChannel,
    DeleteChannel: DeleteChannel,
    CreatePost: CreatePost,
    GetPosts: GetPosts,
    GetPost: GetPost,
    DeletePost: DeletePost,
    GetChannelUsers: GetChannelUsers,
}