import { ObjectId } from 'bson';

//DELETE: All these id+name types when once they are not in used
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

/** Diets */
export type DietIdAndName = {
    dietId: ObjectId | string,
    dietName: string
};

/** Chronic/Physical Conditions */
export type ConditionIdAndName = {
    conditionId: ObjectId | string,
    conditionName: string
};
/** Cookie options */
export type CookieOptions = {
    expires?: Date,
    httpOnly: boolean,
    secure?: boolean,
}