import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import ProgramPlanSchema from '../../util/database/schemas/activities/programPlanSchema';

const ProgramPlanModel = mongoose.model('ProgramPlan', ProgramPlanSchema);

export default class ProgramPlanHandler {
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
      .populate('assignedBy', 'fullName');
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramPlanModel.findByIdAndDelete(id);
  }
}
