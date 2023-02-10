import { ObjectId } from 'bson';
import { IEquipment } from '../../util/interfaces/activitiesInterfaces';
import { IdAndName } from '../../util/types/types';
import EquipmentSchema from '../../util/database/schemas/activities/equipmentSchema';
import mongoose from 'mongoose';

const EquipmentModel = mongoose.model('Equipment', EquipmentSchema);

export default class EquipmentHandler implements IEquipment {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    description: string;
    linkToImage: string;

    static _names: IdAndName[];
    
    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }
    
    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    async save() {
        return await new EquipmentModel(this).save();
    }

    async update() {
      return await EquipmentModel.updateOne({_id: this.id}, this);
    }

    static async fetchByName(name: string) {
        return await EquipmentModel.findOne({name: name});
    }

    static async fetchById(id: string | ObjectId) {
        return await EquipmentModel.findById(id);
    }

    static async fetchAll() {
        return await EquipmentModel.find()
    }

    //extracts id and name properties and creates a new object with {id, name}
    static async fetchAllNames()  {
        return await EquipmentModel.find({}, 'name');
    }

    static async deleteById(id: string | ObjectId) {
      return await EquipmentModel.findByIdAndDelete(id);
    }

    static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
      //forces to fetch all names if a new equipments has been added to the db
      if (objectId) {
        const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
        if (index === -1) forceFetch = true;
      }
  
      //Only fetches names the first time or when it's forced
      if (!this._names || forceFetch) {
        await EquipmentHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
      }
  
      return this._names;
    } 
  
    //removes food from the list of names once it's been deleted
    static removeNameById(objectId: string){
      const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
      if (index > -1){
        this._names.splice(index, 1);
      }
    }
};