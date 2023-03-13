import { ObjectId } from 'bson';

export interface IUserAuth {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    passwordChangedAt: Date;
    role: string;
    imageLink: string;
}

export interface IUserInfo {
    userAuthId: ObjectId | string;
    mainGoal: string;
    basicInfo: IUserBasicInfo;
}

export interface IUserBasicInfo {
    birthday: number;
    weight: number;
    height: number;
    sex: string;
}