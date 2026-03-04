export type tokenResponse = {
    token : string
};

export  type ErrorResponse = {
    timestamp: string;
    status: number;
    error: string;
    message: string;
}

export type Channel = {
    id: string,
    name: string,
    image: string,
}

export enum PostType{
    TASK = "TASK",  
    NEWS = "NEWS"
}

export type PostShort ={
    id: string,
    label: string,
    type: PostType,
    authorName: string
}
export type Post = {
    id: string,
    label: string,
    text: string,
    type: PostType,
    deadline?: string,
    authorName: string,
    studentSolution? : StudentSolution
}

export type StudentSolution = {
    id: string;
    studentId: number;   
    studentName: string;
    taskId: string;       
    taskLabel: string;
    teacherId: number;    
    teacherName: string;
    text: string;
    fileUrl: string;
    fileName: string;
    mark: number;     
    submittedAt: string;  
    updatedAt: string;   
    markedAt: string;   
}

export type ChannelUser ={
    id : number,
    name : string,
    surname : string
    email : string
}

export type MaxChannelInfoAPI ={
    id: string,
    name: string,
    description: string,
    image: string,
    users : ChannelUser[]
}

export const PostTypeTranslations: Record<PostType, string> = {
    [PostType.TASK]: "Задача",
    [PostType.NEWS]: "Новость"
};