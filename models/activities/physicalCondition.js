const physicalConditions = [];

module.exports = class PhysicalConditions {
    id;
    name;
    description;
    symptoms;
    causes;
    treatments;
    tests;

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

    static fetchByName(name) {
        return physicalConditions.find(f => f.name === name);
    }

    static fetchById(id) {
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