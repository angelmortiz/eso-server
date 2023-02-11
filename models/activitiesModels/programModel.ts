import { ObjectId } from 'mongodb';
import { IProgram } from '../../util/interfaces/activitiesInterfaces';
import mongoose from 'mongoose';
import ProgramSchema from '../../util/database/schemas/activities/programSchema';

const ProgramModel = mongoose.model('Program', ProgramSchema);

export default class ProgramHandler {
  static async save(program: IProgram) {
    return await new ProgramModel(program).save();
  }

  static async update(_id: string | ObjectId, program: IProgram) {
    return await ProgramModel.updateOne({ _id }, program, {
      runValidators: true,
    });
  }

  static async fetchByName(name: string) {
    return await ProgramModel.findOne({ name });
  }

  static async fetchById(id: string | ObjectId) {
    // return await ProgramModel.findById(id).populate('workouts.workout', 'name');
    return await ProgramModel.findById(id).populate({
      path: 'workouts.workout',
      select: 'name exercises',
      populate: {
        path: 'exercises.exercise',
        select: 'name alternativeName',
      },
    });
  }

  static async fetchProgramInfo(
    id: string | ObjectId
  ) {
    return await ProgramModel.findById(id).populate({
      path: 'workouts.workout',
      select: 'name exercises',
      populate: {
        path: 'exercises.exercise',
        select: 'name alternativeName',
      },
    }) as IProgram;
  }

  static async fetchAll() {
    return await ProgramModel.find().populate('workouts.workout', 'name');
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await ProgramModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramModel.findByIdAndDelete(id);
  }
}
