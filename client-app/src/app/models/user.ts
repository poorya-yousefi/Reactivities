export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface IUserFormValues {
    displayName?: string;
    username?: string;
    password: string;
    email: string;
}
