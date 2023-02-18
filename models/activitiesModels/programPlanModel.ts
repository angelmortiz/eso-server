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
          select: 'name target type exercises',
          populate: {
            path: 'exercises.exercise',
            select: 'name alternativeName',
          },
        },
      });
  }

  static async fetchByAssignedTo(
    assignedTo: string | ObjectId,
    isCompletedFilter: boolean = false
  ) {
    return await ProgramPlanModel.find({
      $and: [{ assignedTo }, { 'logs.log.isCompleted': isCompletedFilter }],
    })
      .select('-logs.weeksLog') //filters out logs to improve efficiency
      .populate('program', '-workouts')
      .populate('assignedTo', 'fullName')
      .populate('assignedBy', 'fullName')
      .populate({
        path: 'weeksPlan.workouts',
        populate: {
          path: 'workout',
          select: 'name target type exercises',
          populate: {
            path: 'exercises.exercise',
            select: 'name alternativeName',
          },
        },
      });
  }

  static async fetchPlanLogsById(id: string | ObjectId) {
    return await this.findProgramPlanLogs(
      id,
      'name',
      'name alternativeName'
    );
  }

  static async fetchWorkoutPlanLogs(id: string | ObjectId) {
    return await this.findProgramPlanLogs(
      id,
      '',
      'name alternativeName'
    );
  }

  static async findProgramPlanLogs(
    id: string | ObjectId,
    workoutFilters: string,
    exerciseFilters: string
  ) {
    return (await ProgramPlanModel.findById(id)
      .select('-weeksPlan')
      .populate('program', '-workouts')
      .populate('assignedTo', 'fullName')
      .populate('assignedBy', 'fullName')
      .populate('logs.weeksLog.workouts.workout', workoutFilters)
      .populate(
        'logs.weeksLog.workouts.exercises.exercise',
        exerciseFilters
      )) as IProgramPlan;
  }

  static async deleteById(id: string | ObjectId) {
    return await ProgramPlanModel.findByIdAndDelete(id);
  }
}
