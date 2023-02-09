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

/** Exercises */
export type ExerciseIdAndName = {
    exerciseId: ObjectId | string,
    exerciseName: string
};

/** Muscles */
export type MuscleIdAndName = {
    muscleId: ObjectId | string,
    muscleName: string
};

/** Equipments */
export type EquipmentIdAndName = {
    equipmentId: ObjectId | string,
    equipmentName: string
};

/** Cookie options */
export type CookieOptions = {
    expires?: Date,
    httpOnly: boolean,
    secure?: boolean,
}