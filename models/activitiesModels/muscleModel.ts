import { ObjectId } from 'bson';
import { IMuscle } from '../../util/interfaces/activitiesInterfaces';
import { ExerciseIdAndName, IdAndName } from '../../util/types/types';
import MuscleSchema from '../../util/database/schemas/activities/muscleSchema';
import mongoose from 'mongoose';

const MuscleModel = mongoose.model('Muscle', MuscleSchema);

export default class MuscleHandler implements IMuscle {
  id: ObjectId | string;
  name: string;
  alternativeName: string;
  type: string;
  exercises: ExerciseIdAndName[] | null;
  linkToImage: string;

  static _names: IdAndName[];

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new MuscleModel(this).save();
  }

  async update() {
    return await MuscleModel.updateOne({ _id: this.id }, this);
  }

  static async fetchByName(name: string) {
    return await MuscleModel.findOne({ name: name });
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

  static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
    //forces to fetch all names if a new muscles has been added to the db
    if (objectId) {
      const index: number = this._names?.findIndex(
        (obj) => obj._id.toString() === objectId
      );
      if (index === -1) forceFetch = true;
    }

    //Only fetches names the first time or when it's forced
    if (!this._names || forceFetch) {
      await MuscleHandler.fetchAllNames().then(
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
