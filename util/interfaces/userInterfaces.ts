import { ObjectId } from 'bson';

export interface IUserAuth {
    firstName: string;
    lastName: string;
    fullName: string;
    email?: string;
    password?: string;
    passwordChangedAt: Date;
    role: string;
    imageLink?: string;
    betaUser?: boolean;
    betaRole?: string;
    strategy: string;
    profileId?: string;
}

export interface IBetaUserAuth {
    _id?: ObjectId;
    code: string;
    email?: string;
    profileId?: string;
    strategy?: string;
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