import axios, {AxiosError} from 'axios';
import { tokenResponse, ErrorResponse, Channel, PostType, PostShort, Post, MaxChannelInfoAPI } from '../types';
import { FullInfo, CreateUser, UpdateUser, UserRole, SearchParams} from '../types';


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
        await instance.delete(`api/posts/${id}`,  {
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
        await instance.post(`api/posts`,
        {
            label: label,
            text: text,
            type: type,
            deadline: deadline,
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
        const { data, status } = await instance.get<PostShort[]>(`api/posts/channel/${channelId}`, {
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
        const { data, status } = await instance.get<Post>(`api/posts/${postId}`, {
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

async function getAllUsers(): Promise<FullInfo[]> {
    try {
        const { data } = await instance.get<FullInfo[]>('users', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});

        return data;
    } catch (e) {
        console.error("Failed to fetch users:", e);
        throw e;
    }
}


async function getUserById(id: number): Promise<FullInfo> {
    try {
        const { data } = await instance.get<FullInfo>(`users/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error(`Failed to fetch user ${id}:`, e);
        throw e;
    }
}


async function createUser(userData: CreateUser): Promise<FullInfo> {
    try {
        const { data } = await instance.post<FullInfo>('users', userData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error("Failed to create user:", e);
        throw e;
    }
}

async function updateUser(id: number, userData: UpdateUser): Promise<FullInfo> {
    try {
        const { data } = await instance.put<FullInfo>(`users/${id}`, userData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error(`Failed to update user ${id}:`, e);
        throw e;
    }
}

async function deleteUser(id: number): Promise<void> {
    try {
        await instance.delete(`users/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
    } catch (e) {
        console.error(`Failed to delete user ${id}:`, e);
        throw e;
    }
}

async function addRoleToUser(id: number, role: UserRole): Promise<FullInfo> {
    try {
        const { data } = await instance.post<FullInfo>(`users/${id}/add-role`, { role }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error(`Failed to add role to user ${id}:`, e);
        throw e;
    }
}

async function removeRoleFromUser(id: number, role: UserRole): Promise<FullInfo> {
    try {
        const { data } = await instance.post<FullInfo>(`users/${id}/remove-role`, { role }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error(`Failed to remove role from user ${id}:`, e);
        throw e;
    }
}

async function deactivateUser(id: number): Promise<FullInfo> {
    try {
        const { data } = await instance.patch<FullInfo>(`users/${id}/deactivate`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error(`Failed to deactivate user ${id}:`, e);
        throw e;
    }
}

async function activateUser(id: number): Promise<FullInfo> {
    try {
        const { data } = await instance.patch<FullInfo>(`users/${id}/activate`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error(`Failed to activate user ${id}:`, e);
        throw e;
    }
}

async function changePassword(oldPassword: string, newPassword: string): Promise<FullInfo> {
    try {
        const { data } = await instance.patch<FullInfo>('users/change-password', {
            oldPassword,
            newPassword
        }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error("Failed to change password:", e);
        throw e;
    }
}

async function getProfile(): Promise<FullInfo> {
    try {
        const { data } = await instance.get<FullInfo>('users/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error("Failed to fetch profile:", e);
        throw e;
    }
}

async function searchUsers(params: SearchParams): Promise<FullInfo[]> {
    try {
        const { data } = await instance.post<FullInfo[]>('users/search', params, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }});
        return data;
    } catch (e) {
        console.error("Failed to search users:", e);
        throw e;
    }
}

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


    getAllUsers: getAllUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    
    addRoleToUser: addRoleToUser,
    removeRoleFromUser: removeRoleFromUser,
    deactivateUser: deactivateUser,
    activateUser: activateUser,
    getProfile: getProfile,
    changePassword: changePassword,
    searchUsers: searchUsers,
}