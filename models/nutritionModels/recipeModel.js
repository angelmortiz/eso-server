const recipes = [];

module.exports = class Recipe {
    id;
    name;
    description;
    preparationTime;
    complexity;
    mealType;
    ingredients;
    instructions;
    source;
    tools;
    nutritionFacts;
    safeForConditions;
    notRecommendedForConditions;
    recommendedForCyclePhases;
    dietFriendly;
    linkToImage;
    linkToVideo;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        recipes.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return recipes.find(f => f.name === name);
    }

    static fetchById(id) {
        return recipes.find(f => f.id === id);
    }

    static fetchAll() {
        return recipes;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return recipes.map(f => ({id: f.id, name: f.name}));
    }
};