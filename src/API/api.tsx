import axios, {AxiosError} from 'axios';
import { tokenResponse, ErrorResponse, Channel, PostType, PostShort, Post, MaxChannelInfoAPI, UserProfile, StudentSolution, CommentDTO } from '../types';


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

async function CreatePost(label: string, text: string, type : string, deadline: string, channelId :string, file : File | null)   { 
    try
    {
        const formData = new FormData();
        formData.append('label', label);
        formData.append('text', text);
        formData.append('type', type);
        formData.append('deadline', deadline);
        formData.append('needMark', (type == PostType.TASK).toString()); 
        formData.append('channelId', channelId);
        if(file != null) {formData.append('file', file);} 

        await instance.post(`api/posts`,
            formData,
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

async function StudentSendTask(taskId: string, text: string, file : File | null)   { 
    try 
    {
        const formData = new FormData();
        formData.append('taskId', taskId)
        formData.append('text', text)
        if(file != null) { formData.append('file', file )}
        
        await instance.post('solutions', 
        formData,
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

async function StudentChangeTask(taskId: string, text: string, file : File | null)   { 
    try 
    {
        const formData = new FormData();

        formData.append('text', text)
        if(file != null) { formData.append('file', file )}

        await instance.put(`solutions/${taskId}`, 
            formData,
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
async function StudentDeleteTask(taskId: string)   { 
    try 
    {
        await instance.delete(`solutions/${taskId}`,
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

async function GetActiveStudentUsers()   { 
    try 
    {
        const { data, status } = await instance.get<UserProfile[]>(`users`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        console.log(data);
        const activeStudents = data.filter(user => 
            user.isActive === true && user.role.includes("STUDENT")
        );
        
        return activeStudents
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};
async function AddUserToChannel(userId: number, channelId : string)   { 
    try 
    {
        const { data, status } = await instance.post(`channel/${channelId}/user/${userId}`, '', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};
async function GetMyProfile()   { 
    try 
    {
        const { data, status } = await instance.get<UserProfile>(`users/profile`, {
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

async function GetPostSolutions(postId : string)   { 
    try 
    {
        const { data, status } = await instance.get< StudentSolution[]>(`solutions/task/${postId}`, {
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

async function OrderSolution(solutionId : string, mark : number)   { 
    try 
    {
        await instance.post(`solutions/grade`, {
            solutionId : solutionId,
            mark : mark
        },
        
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


async function GetCommentsOfPost(postId : string)   { 
    try 
    {
        const { data, status } = await instance.get< CommentDTO[]>(`comment/post/${postId}`, {
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

async function SendComment(postId : string, text : string)   { 
    try 
    {
        await instance.post(`comment/post/${postId}`, {text : text},{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};

async function ChangeComment(commentId : number, text : string)   { 
    try 
    {
        await instance.put(`comment/${commentId}`,   {text: text },{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};

async function DeleteComment(commentId : number)   { 
    try 
    {
        await instance.delete(`comment/${commentId}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
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
    StudentSendTask : StudentSendTask,
    StudentChangeTask : StudentChangeTask,
    StudentDeleteTask : StudentDeleteTask,
    GetActiveStudentUsers : GetActiveStudentUsers,
    AddUserToChannel : AddUserToChannel,
    GetMyProfile : GetMyProfile,
    GetPostSolutions : GetPostSolutions,
    OrderSolution : OrderSolution,
    GetCommentsOfPost : GetCommentsOfPost,
    SendComment : SendComment,
    ChangeComment : ChangeComment, 
    DeleteComment : DeleteComment
}