import { ObjectId } from 'mongodb';
import { IWorkout } from '../../util/interfaces/activitiesInterfaces';
import mongoose from 'mongoose';
import WorkoutSchema from '../../util/database/schemas/activities/workoutSchema';

const WorkoutModel = mongoose.model('Workout', WorkoutSchema);

export default class WorkoutHandler {
  static async save(workout: IWorkout) {
    return await new WorkoutModel(workout).save();
  }

  static async update(_id: string | ObjectId, workout: IWorkout) {
    return await WorkoutModel.updateOne({ _id }, workout, {
      runValidators: true,
    });
  }

  static async fetchById(id: string | ObjectId) {
    return await WorkoutModel.findById(id).populate(
      'exercises.exercise',
      'name'
    );
  }

  static async fetchAll() {
    return await WorkoutModel.find().populate('exercises.exercise', 'name');
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await WorkoutModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await WorkoutModel.findByIdAndDelete(id);
  }
}
