import { ObjectId } from 'bson';

export interface IUser {
    id: ObjectId | string;
    name: string;
    email: string;
    password: string;
    imageLink: string;
}