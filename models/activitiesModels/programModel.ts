import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import ProgramSchema from '../../util/database/schemas/activities/programSchema';
import {
  IProgram,
  IProgramPlan,
} from '../../util/interfaces/activitiesInterfaces';

const ProgramModel = mongoose.model('Program', ProgramSchema);

export default class ProgramHandler implements IProgram {
  id: string | ObjectId;
  name: string;
  description?: string | undefined;
  type: 'Mixed' | 'Strength' | 'Hypertrophy' | 'Endurance';
  sequence: 'Weekly' | 'Cycle';
  duration?: string | undefined;
  workouts?: IProgramPlan[] | undefined;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new ProgramModel(this).save();
  }

  async update() {
    return await ProgramModel.updateOne({ _id: this.id }, this);
  }

  static async fetchByName(name: string) {
    return await ProgramModel.findOne({ name: name });
  }

  static async fetchById(id: string | ObjectId) {
    return await ProgramModel.findById(id);
  }

  static async fetchAll() {
    return await ProgramModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await ProgramModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramModel.findByIdAndDelete(id);
  }
}
