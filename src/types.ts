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
    CONTROL = "CONTROL",
    TEAM_TASK = "TEAM_TASK"
}

export type PostShort ={
    id: string,
    label: string,
    type: PostType,
    authorName: string,
    totalComments : number
}

export type IdLabelDto ={
    id : string,
    label : string
}

export type ControlDto ={
    postId : string,
    channelId : string,
    postTaskIds : IdLabelDto[],
    taskIds: IdLabelDto[]
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
    studentSolution? : StudentSolution,
    isMetricsVisibleToStudents : boolean,
    control : ControlDto,
    deadlinePenalty : DeadlinePenaltyDto
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
    [PostType.TEAM_TASK]: "Командное задание",
    [PostType.CONTROL] : "Контрольная"
};

export type UserRole = 'STUDENT' | 'TEACHER' | 'MANAGER';

export const ROLES = {
    STUDENT: 'STUDENT' as UserRole,
    TEACHER: 'TEACHER' as UserRole,
    MANAGER: 'MANAGER' as UserRole
};

export enum MetricType{
    MARK = "MARK",  
    COEFFICIENT = "COEFFICIENT",
    CONSTRAINT  = "CONSTRAINT "
}

export const MetricTranslations: Record<MetricType, string> = {
    [MetricType.MARK]: "Оценка",
    [MetricType.COEFFICIENT]: "Коэффициент",
    [MetricType.CONSTRAINT]: "Ограничение"
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
  isMetricsVisibleToStudents : boolean;
  deadlinePenalty :	DeadlinePenaltyDto
}


export interface TaskDocumentDto {
    fileName: string;
    fileUrl: string;
}


export interface TaskSolutionDto {
    id: string;
    taskId: string;
    studentId: number;
    teamId: string;
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

export interface MarkDistribution {
    user : UserProfile,
    mark : number
}
export type CreateMetricDTO ={
    name: string,
    comment: string,
    minValue: number,
    maxValue: number,
    type: MetricType,
    isVisibleToStudents: boolean,
    isValuesVisibleToStudents: boolean,
    postId : string | null,
    taskId : string | null
}

export type MetricDTO ={
    id : string
    name: string,
    comment: string,
    minValue: number,
    maxValue: number,
    type: MetricType,
    isVisibleToStudents: boolean,
    isValuesVisibleToStudents: boolean,
    postId : string | null,
    taskId : string | null
}
export type MetricValueDto ={
    userId : number,
    value : number
}
export type MetricWithValuesDto = {
    metric : MetricDTO,
    values : MetricValueDto[]
}

export type SetMetricValueDto = {
    metricId :	string,
    userId:	number,
    value:	number
}
export type GradeDto = {
    targetId : string,
    value : number
}

export type SetTeamMetricValueDto= {
    metricId :	string,
    teamId:	string,
    value:	number
}

export type GradeTableTargetDto = {
    targetId : string,
    label : string,
    type : MarkType
}
export type GradeTableCellDto ={
    targetId : string,
    rawValue : number,
    controlIds : string[]
}

export type GradeTableRowDto = {
    userId : number,
    userName : string,
    channelGrade : number,
    grades : GradeTableCellDto[]
}

export type GradeTableDto = {
    targets : GradeTableTargetDto[],
    rows : GradeTableRowDto[]
}

export enum MarkType{
    POST_TASK = "POST_TASK",  
    TASK = "TASK",
    CONTROL   = "CONTROL"
}

export const MarkTranslations: Record<MarkType, string> = {
    [MarkType.POST_TASK]: "Задание",
    [MarkType.TASK]: "Командое задание",
    [MarkType.CONTROL]: "Контрольная"
};

export enum UnitType{
    MINUTE = "MINUTE",  
    HOUR = "HOUR",
    DAY    = "DAY"
}

export const UnitTypeTranslations: Record<UnitType, string> = {
    [UnitType.MINUTE]: "минуту",
    [UnitType.HOUR]: "час",
    [UnitType.DAY]: "день"
};
export type DeadlinePenaltyDto ={
    unit: UnitType,
    step: number,
    value: number
}
export enum ReviewStatus{
    PENDING = "PENDING",  
    COMPLETED = "COMPLETED",
    EXPIRED     = "EXPIRED"
}

export const ReviewStatusTranslation: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: "на рассмотрении",
    [ReviewStatus.COMPLETED]: "оценено",
    [ReviewStatus.EXPIRED]: "просрочено"
};

export type PersonalReviewTaskDto = {
    id : string,
    post : Post,
    owner : ChannelUser,
    targetSolutionId : string,
    status : ReviewStatus
};

export type TeamReviewTaskDto ={
    id :string,
    task : Task,
    ownerTeam : Team,
    targetSolutionId : string,
    status : ReviewStatus
}

export type ReviewTasksDto ={
    personal : PersonalReviewTaskDto[],
    team : TeamReviewTaskDto[]
}

export type TaskSolutionType = 'LAST' | 'FIRST' | 'CAPITAN' | 'DEMOCRATIC' | 'QUALIFIED';