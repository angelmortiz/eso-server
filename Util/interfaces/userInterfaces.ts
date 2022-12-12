import { ObjectId } from 'bson';
import { StringExpressionOperatorReturningBoolean } from 'mongoose';

export interface IUser {
    id: ObjectId | string;
    name: string;
    email: string;
    password: string;
    passwordChangedAt: Date;
    role: string;
    imageLink: string;
}