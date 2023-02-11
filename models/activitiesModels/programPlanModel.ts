import { ObjectId } from 'mongodb';
import { IProgramPlan } from '../../util/interfaces/activitiesInterfaces';
import mongoose from 'mongoose';
import ProgramPlanSchema from '../../util/database/schemas/activities/programPlanSchema';

const ProgramPlanModel = mongoose.model('ProgramPlan', ProgramPlanSchema);

export default class ProgramPlanHandler {
  static async save(programPlan: IProgramPlan) {
    return await new ProgramPlanModel(programPlan).save();
  }

  static async update(_id: string | ObjectId, programPlan: IProgramPlan) {
    return await ProgramPlanModel.updateOne({ _id }, programPlan, {
      runValidators: true,
    });
  }

  static async fetchById(id: string | ObjectId) {
    return await ProgramPlanModel.findById(id)
      .populate('program', '-workouts')
      .populate('assignedTo', 'fullName')
      .populate('assignedBy', 'fullName')
      .populate({
        path: 'weeksPlan.workouts',
        populate: {
          path: 'workout',
          select: 'name exercises',
          populate: {
            path: 'exercises.exercise',
            select: 'name alternativeName',
          },
        },
      });
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramPlanModel.findByIdAndDelete(id);
  }
}
