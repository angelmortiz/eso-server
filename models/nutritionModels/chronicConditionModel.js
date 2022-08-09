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

    static chronicConditionsStaticValues = {
        //TODO: DELETE ME AND FETCH FROM DB
        chronicConditions: [
          {_id: "", name: "-- Elige --"},
          {_id: "62db25e82aeacf742c2883b6", name: "Diabetes tipo 2"},
          {_id: "62db26da2aeacf742c2883b7", name: "Diabetes tipo 1"},
          {_id: "62db26fc2aeacf742c2883b9", name: "Enfermedades autoinnmunes"},
          {_id: "62e448bc2aeacf742c28849d", name: "Alta presión"}
        ]
    }
};