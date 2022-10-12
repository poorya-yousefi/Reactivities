import { IUser } from "./user";

export interface Profile {
    userName: string;
    displayName: string;
    image?: string;
    bio?: string;
    following: boolean;
    followingsCount: number;
    followersCount: number;
    photos?: Photo[];
}

export class Profile implements Profile {
    constructor(user: IUser) {
        this.userName = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}
