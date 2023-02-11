import { ObjectId } from 'bson';
import { IChronicCondition } from '../../util/interfaces/nutritionInterfaces';
import { IdAndName } from '../../util/types/types';
import ChronicConditionSchema from '../../util/database/schemas/nutrition/chronicConditionSchema';
import mongoose from 'mongoose';

const ChronicConditionModel = mongoose.model(
  'ChronicCondition',
  ChronicConditionSchema
);

export default class ChronicConditionHandler implements IChronicCondition {
  id: ObjectId | string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  tests: string[];

  static _names: IdAndName[];

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new ChronicConditionModel(this).save();
  }

  async update() {
    return await ChronicConditionModel.updateOne({ _id: this.id }, this, {runValidators: true});
  }


  static async fetchById(id: string | ObjectId) {
    return await ChronicConditionModel.findById(id);
  }

  static async fetchAll() {
    return await ChronicConditionModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await ChronicConditionModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await ChronicConditionModel.findByIdAndDelete(id);
  }

  static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
    //forces to fetch all names if a new conditions has been added to the db
    if (objectId) {
      const index: number = this._names?.findIndex(
        (obj) => obj._id.toString() === objectId
      );
      if (index === -1) forceFetch = true;
    }

    //Only fetches names the first time or when it's forced
    if (!this._names || forceFetch) {
      await ChronicConditionHandler.fetchAllNames().then(
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
