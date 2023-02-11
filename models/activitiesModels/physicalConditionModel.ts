import { ObjectId } from 'bson';
import { IPhysicalCondition } from '../../util/interfaces/activitiesInterfaces';
import PhysicalConditionSchema from '../../util/database/schemas/activities/physicalConditionSchema';
import mongoose from 'mongoose';

const PhysicalConditionModel = mongoose.model(
  'PhysicalCondition',
  PhysicalConditionSchema
);

export default class PhysicalConditionHandler {
  static async save(condition: IPhysicalCondition) {
    return await new PhysicalConditionModel(condition).save();
  }

  static async update(_id: string | ObjectId) {
    return await PhysicalConditionModel.updateOne({ _id }, this, {
      runValidators: true,
    });
  }

  static async fetchByName(name: string) {
    return await PhysicalConditionModel.findOne({ name });
  }

  static async fetchById(id: string | ObjectId) {
    return await PhysicalConditionModel.findById(id);
  }

  static async fetchAll() {
    return await PhysicalConditionModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await PhysicalConditionModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await PhysicalConditionModel.findByIdAndDelete(id);
  }
}
