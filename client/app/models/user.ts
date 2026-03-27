export interface IUser {
    id: string;
    email: string;
    role: string;
    userName: string;
    avatarUrl: string | null;
}


export interface AuthData {
    user:IUser|null,
    isCheckingAuth:boolean
}