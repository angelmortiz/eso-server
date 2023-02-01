import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import WorkoutSchema from '../../util/database/schemas/activities/workoutSchema';
import {
  IExercisePlan,
  IWorkout,
} from '../../util/interfaces/activitiesInterfaces';

const WorkoutModel = mongoose.model('Workout', WorkoutSchema);

export default class WorkoutHandler implements IWorkout {
  id: string | ObjectId;
  name: string;
  description?: string | undefined;
  variant?: string | undefined;
  type: 'Strength' | 'Hypertrophy' | 'Endurance';
  target?:
    | 'Mixed'
    | 'Full Body'
    | 'Upper Body'
    | 'Lower Body'
    | 'Front Muscles'
    | 'Back Muscles'
    | undefined;
  linkToImage?: string;
  exercises?: IExercisePlan[] | undefined;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new WorkoutModel(this).save();
  }

  async update() {
    return await WorkoutModel.updateOne({ _id: this.id }, this, {
      runValidators: true,
    });
  }

  static async fetchByName(name: string) {
    return await WorkoutModel.findOne({ name: name });
  }

  static async fetchById(id: string | ObjectId) {
    return await WorkoutModel.findById(id);
  }

  static async fetchAll() {
    return await WorkoutModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await WorkoutModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await WorkoutModel.findByIdAndDelete(id);
  }
}
