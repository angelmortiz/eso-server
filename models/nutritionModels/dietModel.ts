import { ObjectId } from 'bson';
import { IDiet } from '../../util/interfaces/nutritionInterfaces';
import { ConditionIdAndName, IdAndName } from '../../util/types/types';
import DietSchema from '../../util/database/schemas/nutrition/dietSchema';
import mongoose from 'mongoose';

const DietModel = mongoose.model('Diet', DietSchema);

export default class DietHandler implements IDiet {
  id: ObjectId | string;
  name: string;
  officialName: string;
  description: string;
  safeForConditions: ConditionIdAndName[] | null;

  static _names: IdAndName[];

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new DietModel(this).save();
  }

  async update() {
    return await DietModel.updateOne({ _id: this.id }, this, {runValidators: true});
  }

  static async fetchByName(name: string) {
    return await DietModel.findOne({ name: name });
  }

  static async fetchById(id: string | ObjectId) {
    return await DietModel.findById(id);
  }

  static async fetchAll() {
    return await DietModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await DietModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await DietModel.findByIdAndDelete(id);
  }

  static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
    //forces to fetch all names if a new food has been added to the db
    if (objectId) {
      const index: number = this._names?.findIndex(
        (obj) => obj._id.toString() === objectId
      );
      if (index === -1) forceFetch = true;
    }

    //Only fetches names the first time or when it's forced
    if (!this._names || forceFetch) {
      await DietHandler.fetchAllNames().then(
        (fetchedNames) => (this._names = fetchedNames)
      );
    }

    return this._names;
  }

  //removes food from the list of names once it's been deleted
  static removeNameById(objectId: string) {
    const index: number = this._names?.findIndex(
      (obj) => obj._id.toString() === objectId
    );
    if (index > -1) {
      this._names.splice(index, 1);
    }
  }
}
