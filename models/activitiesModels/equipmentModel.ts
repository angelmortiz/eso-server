import { ObjectId } from 'bson';
import { IEquipment } from '../../util/interfaces/activitiesInterfaces';
import EquipmentSchema from '../../util/database/schemas/activities/equipmentSchema';
import mongoose from 'mongoose';

const EquipmentModel = mongoose.model('Equipment', EquipmentSchema);

export default class EquipmentHandler {

  static async save(equipment: IEquipment) {
    return await new EquipmentModel(equipment).save();
  }

  static async update(_id: string | ObjectId, equipment: IEquipment) {
    return await EquipmentModel.updateOne({ _id }, equipment, {runValidators: true});
  }

  static async fetchById(id: string | ObjectId) {
    return await EquipmentModel.findById(id);
  }

  static async fetchAll() {
    return await EquipmentModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await EquipmentModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await EquipmentModel.findByIdAndDelete(id);
  }
}
