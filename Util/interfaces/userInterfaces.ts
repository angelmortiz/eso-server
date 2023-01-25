import { ObjectId } from 'bson';

export interface IUser {
    _id: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordChangedAt: Date;
    role: string;
    imageLink: string;
}