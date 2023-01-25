import { ObjectId } from 'bson';
import { IPhysicalCondition } from '../../util/interfaces/activitiesInterfaces';
import { IdAndName } from '../../util/types/types';
import PhysicalConditionSchema from '../../util/database/schemas/activities/physicalConditionSchema';
import mongoose from 'mongoose';

const PhysicalConditionModel = mongoose.model(
  'PhysicalCondition',
  PhysicalConditionSchema
);

export default class PhysicalConditionHandler implements IPhysicalCondition {
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
    return await new PhysicalConditionModel(this).save();
  }

  async update() {
    return await PhysicalConditionModel.updateOne({ _id: this.id }, this);
  }

  static async fetchByName(name: string) {
    return await PhysicalConditionModel.findOne({ name: name });
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

  static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
    //forces to fetch all names if a new physical conditions has been added to the db
    if (objectId) {
      const index: number = this._names?.findIndex(
        (obj) => obj._id.toString() === objectId
      );
      if (index === -1) forceFetch = true;
    }

    //Only fetches names the first time or when it's forced
    if (!this._names || forceFetch) {
      await PhysicalConditionHandler.fetchAllNames().then(
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
