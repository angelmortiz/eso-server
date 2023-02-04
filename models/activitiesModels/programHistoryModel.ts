import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import ProgramHistorySchema from '../../util/database/schemas/activities/programHistorySchema';
import {
  IProgramHistory,
  IWorkoutLogs
} from '../../util/interfaces/activitiesInterfaces';

const ProgramHistoryModel = mongoose.model('ProgramHistory', ProgramHistorySchema);

export default class ProgramHistoryHandler implements IProgramHistory {
    id: string | ObjectId;
    programId: string | ObjectId;
    assignedTo: string | ObjectId;
    assignedOn: Date;
    assignedBy: string | ObjectId;
    isStarted: boolean;
    startedOn?: Date | undefined;
    isCompleted: boolean;
    completedOn?: Date | undefined;
    workoutLogs?: IWorkoutLogs[] | undefined;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new ProgramHistoryModel(this).save();
  }

  async update() {
    return await ProgramHistoryModel.updateOne({ _id: this.id }, this, {runValidators: true});
  }

  static async fetchAll() {
    return await ProgramHistoryModel.find();
  }

  static async fetchById(id: string | ObjectId) {
    return await ProgramHistoryModel.findById(id);
  }

  static async fetchByAssignedTo(assignedBy: string | ObjectId) {
    return await ProgramHistoryModel.find({assignedBy});
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramHistoryModel.findByIdAndDelete(id);
  }
}
