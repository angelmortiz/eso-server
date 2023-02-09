import { ObjectId } from 'bson';
import {
  IEquipment,
  IExercise,
  IMuscle,
  IPhysicalCondition,
} from '../../util/interfaces/activitiesInterfaces';
import ExerciseSchema from '../../util/database/schemas/activities/exerciseSchema';
import mongoose from 'mongoose';

const ExerciseModel = mongoose.model('Exercise', ExerciseSchema);

export default class ExerciseHandler implements IExercise {
  id: string | ObjectId;
  name: string;
  alternativeName: string;
  difficulty: string;
  types: string[];
  compoundMovement: boolean;
  mainMuscle: IMuscle;
  secondaryMuscles: IMuscle[] | null;
  equipments: IEquipment[] | null;
  safeForConditions: IPhysicalCondition[] | null;
  notRecommendedForConditions: IPhysicalCondition[] | null;
  recommendedForCyclePhases: string[];
  linkToVideo: string;
  linkToImage: string;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new ExerciseModel(this).save();
  }

  async update() {
    return await ExerciseModel.updateOne({ _id: this.id }, this);
  }

  static async fetchByName(name: string) {
    return await ExerciseModel.findOne({ name });
  }

  static async fetchById(id: string | ObjectId) {
    return await ExerciseModel.findById(id)
      .populate('mainMuscle', 'name')
      .populate('secondaryMuscles', 'name')
      .populate('equipments', 'name');
  }

  static async fetchAll() {
    return await ExerciseModel.find()
      .populate('mainMuscle', 'name')
      .populate('secondaryMuscles', 'name')
      .populate('equipments', 'name');
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await ExerciseModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await ExerciseModel.findByIdAndDelete(id);
  }

  static exercisesStaticValues = {
    types: [
      { _id: 'Fuerza', name: 'Fuerza' },
      { _id: 'Cardio', name: 'Cardio' },
      { _id: 'HIIT', name: 'HIIT' },
      { _id: 'Estiramiento', name: 'Estiramiento' },
    ],
  };
}
