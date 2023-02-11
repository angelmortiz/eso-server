import { ObjectId } from 'bson';
import { IExercise } from '../../util/interfaces/activitiesInterfaces';
import ExerciseSchema from '../../util/database/schemas/activities/exerciseSchema';
import mongoose from 'mongoose';

const ExerciseModel = mongoose.model('Exercise', ExerciseSchema);

export default class ExerciseHandler {
  static async save(exercise: IExercise) {
    return await new ExerciseModel(exercise).save();
  }

  static async update(_id: string | ObjectId, exercise: IExercise) {
    return await ExerciseModel.updateOne({ _id }, exercise);
  }

  static async fetchById(id: string | ObjectId) {
    return await ExerciseModel.findById(id)
      .populate('mainMuscle', 'name')
      .populate('secondaryMuscles', 'name')
      .populate('equipments', 'name');
  }

  static async fetchAll() {
    return await ExerciseModel.find()
      .populate('mainMuscle', 'name')
      .populate('secondaryMuscles', 'name')
      .populate('equipments', 'name');
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await ExerciseModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await ExerciseModel.findByIdAndDelete(id);
  }

  static exercisesStaticValues = {
    types: [
      { _id: 'Fuerza', name: 'Fuerza' },
      { _id: 'Cardio', name: 'Cardio' },
      { _id: 'HIIT', name: 'HIIT' },
      { _id: 'Estiramiento', name: 'Estiramiento' },
    ],
  };
}
