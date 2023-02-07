import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import ProgramHistorySchema from '../../util/database/schemas/activities/programHistorySchema';
import {
  IProgramHistory,
  IWorkoutLogs,
} from '../../util/interfaces/activitiesInterfaces';

const ProgramHistoryModel = mongoose.model(
  'ProgramHistory',
  ProgramHistorySchema
);

export default class ProgramHistoryHandler implements IProgramHistory {
  id: string | ObjectId;
  programId: string | ObjectId;
  programName: string;
  assignedTo: string | ObjectId;
  assignedToName: string;
  assignedOn: Date;
  assignedBy: string | ObjectId;
  assignedByName: string;
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
    return await ProgramHistoryModel.updateOne({ _id: this.id }, this, {
      runValidators: true,
    });
  }

  static async fetchAll() {
    return await ProgramHistoryModel.find();
  }

  static async fetchById(id: string | ObjectId) {
    return await ProgramHistoryModel.findById(id);
  }

  static async fetchByAssignedTo(assignedToId: string, filter: boolean) {
    //aggregates values for program name and user names
    return await ProgramHistoryModel.aggregate([
      {
        $match: {
          $and: [
            { assignedTo: new ObjectId(assignedToId) },
            { isCompleted: filter },
          ],
        },
      },
      {
        $lookup: {
          from: 'activities.programs',
          localField: 'programId',
          foreignField: '_id',
          as: 'programName',
        },
      },
      {
        $lookup: {
          from: 'users.auth',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedToName',
        },
      },
      {
        $lookup: {
          from: 'users.auth',
          localField: 'assignedBy',
          foreignField: '_id',
          as: 'assignedByName',
        },
      },
      {
        $set: {
          programName: { $arrayElemAt: ['$programName.name', 0] },
          assignedToName: { $arrayElemAt: ['$assignedToName.fullName', 0] },
          assignedByName: { $arrayElemAt: ['$assignedByName.fullName', 0] },
        },
      },
    ]);
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramHistoryModel.findByIdAndDelete(id);
  }
}
