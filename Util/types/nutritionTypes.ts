import { ObjectId } from 'bson';

/** General */
export type IdAndName = {
    _id: ObjectId | string,
    name: string
};

/** Food */
export type FoodIdAndName = {
    foodId: ObjectId | string,
    foodName: string
};

/** Chronic Conditions */
export type ConditionIdAndName = {
    conditionId: ObjectId | string,
    conditionName: string
};

/** Diets */
export type DietnIdAndName = {
    dietId: ObjectId | string,
    dietName: string
};