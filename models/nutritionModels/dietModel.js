const diets = [];

module.exports = class Diet {
    id;
    name;
    officialName;
    description;
    safeForConditions;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        diets.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return diets.find(f => f.name === name);
    }

    static fetchById(id) {
        return diets.find(f => f.id === id);
    }

    static fetchAll() {
        return diets;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return diets.map(f => ({id: f.id, name: f.name}));
    }

    static compatibleWithDietsStaticValues = {
        //TODO: DELETE ME AND FETCH FROM DB
        diets: [
          {_id: "", name: "-- Elige --"},
          {_id: "62e3f8da2aeacf742c28842b", name: "Keto"},
          {_id: "62e3f9a62aeacf742c28842c", name: "Paleo"}
        ]
    }
};