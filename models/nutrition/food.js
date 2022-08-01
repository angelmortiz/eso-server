const foods = [];

module.exports = class Food {
    id;
    name;
    classification;
    description;
    mainMacronutrient;
    secondaryMacronutrient;
    nutritionFacts;
    mealType;
    micronutrientDensity;
    safeForConditions;
    dietFriendly;
    notRecommendedForConditions;
    recommendedForCyclePhases;
    linkToImage;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        foods.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(foodName) {
        return foods.find(f => f.name === foodName);
    }

    static fetchById(foodId) {
        return foods.find(f => f.id === foodId);
    }

    static fetchAll() {
        return foods;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return foods.map(f => ({id: f.id, name: f.name}));
    }
}