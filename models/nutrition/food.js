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
    notRecommendedForConditions;
    recommendedForCyclePhases;
    dietFriendly;
    linkToImage;

    save() {
        foods.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return foods.find(f => f.name === name);
    }

    static fetchById(id) {
        return foods.find(f => f.id === id);
    }

    static fetchAll() {
        return foods;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return foods.map(f => ({id: f.id, name: f.name}));
    }
}