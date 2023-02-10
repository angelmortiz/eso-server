import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import ProgramPlanSchema from '../../util/database/schemas/activities/programPlanSchema';
import { IProgram, IProgramPlan, IWeekPlan } from '../../util/interfaces/activitiesInterfaces';
import { IUserAuth } from '../../util/interfaces/userInterfaces';

const ProgramPlanModel = mongoose.model('ProgramPlan', ProgramPlanSchema);

export default class ProgramPlanHandler implements IProgramPlan {
  id: string | ObjectId;
  program: IProgram;
  assignedTo: IUserAuth;
  assignedOn: Date;
  assignedBy: IUserAuth;
  weeksPlan?: IWeekPlan[] | undefined;
  
  static async save(programPlan) {
    return await new ProgramPlanModel(programPlan).save();
  }

  static async update(id: string | ObjectId, programPlan) {
    return await ProgramPlanModel.updateOne({ _id: id }, programPlan, {
      runValidators: true,
    });
  }

  static async fetchById(id: string | ObjectId) {
    return await ProgramPlanModel.findById(id)
      .populate('program', '-workouts')
      .populate('assignedTo', 'fullName')
      .populate('assignedBy', 'fullName')
      .populate('weeksPlan.daysPlan.workoutPlan.workout');
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramPlanModel.findByIdAndDelete(id);
  }
}
