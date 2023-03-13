import { ObjectId } from 'bson';
import { IMuscle } from '../../util/interfaces/activitiesInterfaces';
import MuscleSchema from '../../util/database/schemas/activities/muscleSchema';
import mongoose from 'mongoose';

const MuscleModel = mongoose.model('Muscle', MuscleSchema);

export default class MuscleHandler {
  static async save(muscle: IMuscle) {
    return await new MuscleModel(muscle).save();
  }

  static async update(_id: string | ObjectId, muscle: IMuscle) {
    return await MuscleModel.updateOne({ _id }, muscle, {
      runValidators: true,
    });
  }

  static async fetchById(id: string | ObjectId) {
    return await MuscleModel.findById(id);
  }

  static async fetchAll() {
    return await MuscleModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await MuscleModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await MuscleModel.findByIdAndDelete(id);
  }
}
