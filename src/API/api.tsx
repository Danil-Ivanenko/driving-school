import axios, {AxiosError} from 'axios';
import { tokenResponse, ErrorResponse, Channel, PostType, PostShort, Post, MaxChannelInfoAPI, CommandTeamType, CommandSolutionType, Task, ChannelUser } from '../types';
import { FullInfo, CreateUser, UpdateUser, UserRole, SearchParams} from '../types';
import { UserProfile, StudentSolution, CommentDTO } from '../types';
import { TaskSolutionDto, SolutionVoteDto, VotingResultsDto, TaskDocumentDto, CreateSolutionVoteDto, CreateTaskSolutionDto, UpdateTaskSolutionDto, VoteResultDto, VoterInfoDto} from '../types';




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
        console.log(e)
    }

        try
    {
        await instance.delete(`api/tasks/${id}`,  {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
        
    })
    }
    catch(e)
    {
        console.log(e)
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

async function CreateCommandTask( channelId :string, label: string, text: string, teamType : CommandTeamType, freeTeamCount: number, type : CommandSolutionType, minTeamSize : number, isCanRedistribute : boolean, deadline?: string, qualifiedMin? : number | null, documents? : File | null)   { 
    try
    {
        const formData = new FormData();
        formData.append('label', label);
        formData.append('text', text);
        formData.append('teamType', teamType.toString());
        if(documents != null) {formData.append('documents', documents);} 
        formData.append('freeTeamCount', freeTeamCount.toString() );
        formData.append('type', type.toString());
        formData.append('minTeamSize', minTeamSize.toString());
        if(deadline != null) {formData.append('votingDeadline', deadline);} 
        if(qualifiedMin != null) {formData.append('qualifiedMin', qualifiedMin.toString());} 
        formData.append('isCanRedistribute ', isCanRedistribute.toString() ); 
        
        

        const {data, status} = await instance.post(`api/tasks?channelId=${channelId}`,
            formData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })

        return data
    }
    catch(e)
    {
        return e
    }
};

async function GetTeamTask(taskid: string)   { 
    try 
    {
        const { data, status } = await instance.get<Task>(`api/tasks/${taskid}`, {
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
async function DeleteTeam(id: string)   { 
    try
    {
        await instance.delete(`api/teams/${id}`,  {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
        
    })
    }
    catch(e)
    {
        console.log(e)
    }
}

async function DeleteUserFromTeam(teamId: string, userId : number)   { 
    try
    {
        await instance.delete(`api/teams/${teamId}/members/${userId}`,  {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
        
    })
    }
    catch(e)
    {
        console.log(e)
    }
}

async function CreateTeam(name: string, taskId : string, deadline  : string)   { 
    try 
    {
        const { data, status } =await instance.post(`api/teams`, {name : name, taskId: taskId, deadline: deadline},{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        return data;
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};

async function StudentJoinToTeam(teamId : string)   { 

    try 
    {
        await instance.post(`api/teams/${teamId}/join`, {} ,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};

async function StudentLeaveFromTeam(teamId : string)   { 
    try 
    {
        await instance.delete(`api/teams/${teamId}/leave`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
    } 
    catch (e) 
    {
        console.error( e);
    }
    
    
};

async function createTaskSolution(taskId: string, documents: File[] | null): Promise<TaskSolutionDto> {
    try {
        const formData = new FormData();
        if (documents) {
            documents.forEach(doc => {
                formData.append('documents', doc);
            });
        }

        const { data } = await instance.post<TaskSolutionDto>(
            `api/task-solutions?taskId=${taskId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return data;
    } catch (e) {
        console.error("Failed to create task solution:", e);
        throw e;
    }
}


async function getTaskSolutionById(solutionId: string): Promise<TaskSolutionDto> {
    try {
        const { data } = await instance.get<TaskSolutionDto>(`api/task-solutions/${solutionId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {
        console.error("Failed to fetch task solution:", e);
        throw e;
    }
}


async function updateTaskSolution(solutionId: string, documents: File[] | null): Promise<TaskSolutionDto> {
    try {
        const formData = new FormData();
        if (documents) {
            documents.forEach(doc => {
                formData.append('documents', doc);
            });
        }

        const { data } = await instance.patch<TaskSolutionDto>(
            `api/task-solutions/${solutionId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return data;
    } catch (e) {
        console.error("Failed to update task solution:", e);
        throw e;
    }
}


async function deleteTaskSolution(solutionId: string): Promise<void> {
    try {
        await instance.delete(`api/task-solutions/${solutionId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (e) {
        console.error("Failed to delete task solution:", e);
        throw e;
    }
}


async function getTaskSolutionsByTask(taskId: string): Promise<TaskSolutionDto[]> {
    try {
        const { data } = await instance.get<TaskSolutionDto[]>(`api/task-solutions/task/${taskId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {
        console.error("Failed to fetch task solutions:", e);
        throw e;
    }
}


async function getMyTaskSolutions(): Promise<TaskSolutionDto[]> {
    try {
        const { data } = await instance.get<TaskSolutionDto[]>(`api/task-solutions/my`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {
        console.error("Failed to fetch my solutions:", e);
        throw e;
    }
}

async function voteForSolution(taskId: string, solutionId: string): Promise<SolutionVoteDto> {
    try {
        const { data } = await instance.post<SolutionVoteDto>(
            `api/task-solutions/vote`,
            { taskId, solutionId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return data;
    } catch (e) {
        console.error("Failed to vote for solution:", e);
        throw e;
    }
}


async function cancelVote(taskId: string): Promise<void> {
    try {
        await instance.delete(`api/task-solutions/vote/${taskId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (e) {
        console.error("Failed to cancel vote:", e);
        throw e;
    }
}


async function getMyVote(taskId: string): Promise<SolutionVoteDto | null> {
    try {
        const { data } = await instance.get<SolutionVoteDto>(`api/task-solutions/vote/my/${taskId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {

        return null;
    }
}


async function getSelectedSolution(taskId: string): Promise<TaskSolutionDto | null> {
    try {
        const { data } = await instance.get<TaskSolutionDto>(`api/task-solutions/${taskId}/selected-solution`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {
        return null;
    }
}


async function getVotingResults(taskId: string): Promise<VotingResultsDto> {
    try {
        const { data } = await instance.get<VotingResultsDto>(`api/task-solutions/${taskId}/voting-results`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {
        console.error("Failed to fetch voting results:", e);
        throw e;
    }
}


async function selectAcceptedSolution(taskId: string): Promise<TaskSolutionDto> {
    try {
        const { data } = await instance.post<TaskSolutionDto>(
            `api/task-solutions/${taskId}/select-accepted`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return data;
    } catch (e) {
        console.error("Failed to select accepted solution:", e);
        throw e;
    }
}


async function ChangeCommandTaskRedistribute( taskId :string, isCanRedistribute : boolean)   { 
    try
    {
        const formData = new FormData();

        formData.append('isCanRedistribute ', isCanRedistribute.toString() ); 
        
        

        const {data, status} = await instance.patch(`api/tasks/${taskId}`,
            formData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })

        //return data
    }
    catch(e)
    {
        return e
    }
};

async function GetStudentsWithOutTeam(taskId: string) {
    try {
        const { data } = await instance.get<ChannelUser[]>(`api/tasks/${taskId}/students/without-team`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    } catch (e) {
        console.error("Failed to fetch voting results:", e);
        throw e;
    }
}

async function AddUserToTeam( teamId :string, userId : number)   { 
    try
    {

        

        const {data, status} = await instance.post(`api/teams/${teamId}/members/${userId}`,
            {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })

        //return data
    }
    catch(e)
    {
        return e
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
    DeleteComment : DeleteComment,
    
    CreateCommandTask: CreateCommandTask,
    GetTeamTask : GetTeamTask,
    DeleteTeam : DeleteTeam,
    CreateTeam : CreateTeam,
    DeleteUserFromTeam : DeleteUserFromTeam,
    StudentJoinToTeam : StudentJoinToTeam,
    StudentLeaveFromTeam : StudentLeaveFromTeam,


    createTaskSolution,
    getTaskSolutionById,
    updateTaskSolution,
    deleteTaskSolution,
    getTaskSolutionsByTask,
    getMyTaskSolutions,
    voteForSolution,
    cancelVote,
    getMyVote,
    getSelectedSolution,
    getVotingResults,
    selectAcceptedSolution,

    ChangeCommandTaskRedistribute : ChangeCommandTaskRedistribute,
    GetStudentsWithOutTeam : GetStudentsWithOutTeam,
    AddUserToTeam : AddUserToTeam
}