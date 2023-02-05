import { ObjectId } from 'bson';

export interface IUserAuth {
    id: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordChangedAt: Date;
    role: string;
    imageLink: string;
}

export interface IUserInfo {
    id: ObjectId | string;
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