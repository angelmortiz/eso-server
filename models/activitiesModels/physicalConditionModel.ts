import { ObjectId } from 'bson';
import { IPhysicalConditions } from '../../util/interfaces/activitiesInterfaces';

const physicalConditions: IPhysicalConditions[] = [];

module.exports = class PhysicalConditions implements IPhysicalConditions{
    id: ObjectId | string;
    name: string;
    description: string;
    symptoms: string[];
    causes: string[];
    treatments: string[];
    tests: string[];

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        physicalConditions.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name: string) {
        return physicalConditions.find(f => f.name === name);
    }

    static fetchById(id: string) {
        return physicalConditions.find(f => f.id === id);
    }

    static fetchAll() {
        return physicalConditions;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return physicalConditions.map(f => ({id: f.id, name: f.name}));
    }
};