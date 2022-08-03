const exercises = [];

module.exports = class Exercise {
    id;
    name;
    alternativeName;
    difficulty;
    types;
    compundMovement;
    mainMuscle;
    secondaryMuscles;
    equipments;
    safeForConditions;
    notRecommendedForConditions;
    recommendedForCyclePhases;
    linkToVideo;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        exercises.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return exercises.find(f => f.name === name);
    }

    static fetchById(id) {
        return exercises.find(f => f.id === id);
    }

    static fetchAll() {
        return exercises;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return exercises.map(f => ({id: f.id, name: f.name}));
    }

};