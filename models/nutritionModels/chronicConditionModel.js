const chronicConditions = [];

module.exports = class ChronicCondition {
    id;
    name;
    symptoms;
    causes;
    treatments;
    description;
    tests;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        chronicConditions.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return chronicConditions.find(f => f.name === name);
    }

    static fetchById(id) {
        return chronicConditions.find(f => f.id === id);
    }

    static fetchAll() {
        return chronicConditions;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return chronicConditions.map(f => ({id: f.id, name: f.name}));
    }
};