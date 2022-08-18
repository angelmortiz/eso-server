import { ObjectId } from 'bson';

/** Food */
export type IdAndName = {
    _id: ObjectId | string,
    name: string
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

