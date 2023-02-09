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
  duration: number;
  linkToImage?: string;
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
    return await ProgramModel.updateOne({ _id: this.id }, this, {runValidators: true});
  }

  static async fetchByName(name: string) {
    return await ProgramModel.findOne({ name: name });
  }

  static async fetchById(id: string | ObjectId): Promise<ProgramHandler | null> {
    return await ProgramModel.findById(id);
  }

  static async fetchAllInfoById(id: string | ObjectId): Promise<any | null> {
    /** //IMPROVE: Look for a better way to join collections
     * at the schema level instead of repeating the aggregate logic. */
    return await ProgramModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'activities.exercises',
          localField: 'workouts.workoutId',
          foreignField: '_id',
          as: 'workoutInfo',
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
          programInfo: { $arrayElemAt: ['$programInfo', 0] },
          assignedToName: { $arrayElemAt: ['$assignedToName.fullName', 0] },
          assignedByName: { $arrayElemAt: ['$assignedByName.fullName', 0] },
        },
      },
      {
        $project: { 'programInfo.workouts': 0 },
      },
    ]);
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
