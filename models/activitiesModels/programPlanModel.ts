import { ObjectId } from 'mongodb';
import {
  IProgramPlan,
  ISetLog,
} from '../../util/interfaces/activitiesInterfaces';
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

  static async addSetLog(
    params: {
      programPlanId: string;
      weekId: string;
      workoutPlanId: string;
      exercisePlanId: string;
    },
    setInfo: ISetLog
  ) {
    return await ProgramPlanModel.updateOne(
      {
        _id: params.programPlanId,
      },
      {
        //pushes a new element to the sets array in the path:
        //logs.weeksLog[].workouts[].exercise[].exercise.sets[]
        $push: {
          'logs.weeksLog.$[weekId].workouts.$[workoutId].exercises.$[exerciseId].sets':
            {
              ...setInfo,
              log: {
                isStarted: true,
                startedOn: new Date(),
                isCompleted: true,
                completedOn: new Date()
              }
            },
        },
      },
      {
        //array filters help identify the right exercise to push the new setLog
        arrayFilters: [
          {
            'weekId._id': new ObjectId(params.weekId),
          },
          {
            'workoutId._id': new ObjectId(params.workoutPlanId),
          },
          {
            'exerciseId._id': new ObjectId(params.exercisePlanId),
          },
        ],
      }
    );
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
    return await this.findProgramPlanLogs(id, 'name', 'name alternativeName');
  }

  static async fetchWorkoutPlanLogs(id: string | ObjectId) {
    return await this.findProgramPlanLogs(id, '', 'name alternativeName');
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
