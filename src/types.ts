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
    TEAM_TASK = "TEAM_TASK"
}

export type PostShort ={
    id: string,
    label: string,
    type: PostType,
    authorName: string,
    totalComments : number
}
export type Post = {
    id: string,
    label: string,
    text: string,
    type: PostType,
    deadline?: string,
    authorName: string,
    fileUrl? : string,
    fileName? : string
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
    fileUrl?: string;
    fileName?: string;
    mark?: number;     
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

export type UserProfile ={
    id: number,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    role: string[],
    isActive: boolean
}

export type UserInfoInComment = {
    id: number,
    firstName: string,
    lastName: string,
    age: number,
    phone: string,
    email: string,
    role: string[],
    isActive: boolean
}
// export type Instant = {
//     epochSeconds : number,
//     nanosecondsOfSecond : number
// }

export type CommentDTO ={
    id: number,
    text: string,
    authorDto: UserInfoInComment
}

export enum CommandTeamType{
    RANDOM = "RANDOM",  
    DRAFT = "DRAFT",
    FREE = "FREE"
}

export const CommandTeamTypeTranslations: Record<CommandTeamType, string> = {
    [CommandTeamType.RANDOM]: "Случайно",
    [CommandTeamType.DRAFT]: "Драфт",
    [CommandTeamType.FREE]: "Свободно"
};

export enum CommandSolutionType{
    FREE = "FREE",  
    LAST = "LAST",
    FIRST = "FIRST",
    CAPITAN = "CAPITAN",  
    DEMOCRATIC = "DEMOCRATIC",
    QUALIFIED  = "QUALIFIED"
}


export const PostTypeTranslations: Record<PostType, string> = {
    [PostType.TASK]: "Задача",
    [PostType.NEWS]: "Новость",
    [PostType.TEAM_TASK]: "Командное задание"
};

export type UserRole = 'STUDENT' | 'TEACHER' | 'MANAGER';

export const ROLES = {
    STUDENT: 'STUDENT' as UserRole,
    TEACHER: 'TEACHER' as UserRole,
    MANAGER: 'MANAGER' as UserRole
};

export interface FullInfo {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    phone: string;
    email: string;
    role: UserRole[];
    isActive: boolean;
}

export interface CreateUser {
    firstName: string;
    lastName: string;
    age: number;
    phone: string;
    email: string;
    password: string;
    role: UserRole[];
}

export interface UpdateUser {
    firstName: string;
    lastName: string;
    age: number;
    phone: string;
    email: string;
    role: UserRole[];
}

export interface RoleOperation {
    role: UserRole;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface SearchParams {
    name?: string;
    email?: string;
    role?: UserRole;
}
export interface Team {
  id: string; 
  name: string;
  taskId: string
  captainId: number;
  isAvailableRevote: boolean;
  isCaptainVotingActive: boolean;
  mark: number;
  deadline: string; 
  softDeadline: string; 
  users: ChannelUser[];
}

export interface Task {
  id: string; 
  label: string;
  text: string;
  channelId: string; 
  startAt: string; 
  documents: {fileName : string, fileUrl : string}[];
  teamType: CommandTeamType;
  type: CommandSolutionType
  isCanRedistribute: boolean;
  qualifiedMin: number;
  minTeamSize: number;
  votingDeadline: string; 
  teams: Team[];
}


export interface TaskDocumentDto {
    fileName: string;
    fileUrl: string;
}


export interface TaskSolutionDto {
    id: string;
    taskId: string;
    studentId: number;
    documents: TaskDocumentDto[];
    mark?: number;
    createdAt: string;
    updatedAt?: string;
}


export interface CreateTaskSolutionDto {
    documents?: File[];
}


export interface UpdateTaskSolutionDto {
    documents?: File[];
}


export interface CreateSolutionVoteDto {
    taskId: string;
    solutionId: string;
}


export interface SolutionVoteDto {
    id: string;
    taskId: string;
    solutionId: string;
    voterId: number;
    voterName: string;
}


export interface VotingResultsDto {
    taskId: string;
    taskLabel: string;
    isAnonymous: boolean;
    totalVotes: number;
    results: VoteResultDto[];
}

export interface VoteResultDto {
    solutionId: string;
    solutionLabel: string;
    votesCount: number;
    percentage: number;
    voters: VoterInfoDto[];
}

export interface VoterInfoDto {
    voterId: number;
    voterName: string;
}

export interface InviteDto {
  id: string; 
  teamId: string; 
  teamName: string;
  inviterId: number; 
  inviterName: string;
}

export interface MarkResponse {
    user: FullInfo;
    mark: number;
}