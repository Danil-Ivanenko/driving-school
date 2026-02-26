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
    NEWS = "NEWS",
    LECTURE = "LECTURE"
}

export type PostShort ={
    id: string,
    label: string,
    type: PostType
}
export type Post = {
    id: string,
    label: string,
    text: string,
    type: PostType,
    deadline: string,
    authorId: number
}

export const PostTypeTranslations: Record<PostType, string> = {
    [PostType.TASK]: "Задача",
    [PostType.NEWS]: "Новость",
    [PostType.LECTURE]: "Лекция"
};