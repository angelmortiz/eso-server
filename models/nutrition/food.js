const getDb = require('../../util/database').getNutritionDb;
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

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  save() {
    const db = getDb();
    delete this.id; //removes property before inserting to db to prevent double id to be created
    return db.collection('foods')
      .insertOne(this)
      .then((result) => {
        //FIXME: Add log to a file
        console.log('New data inserted successfully.', result);
      })
      .catch((error) => {
        //FIXME: Add log to a file
        console.log('There was an error trying to insert new data.', error);
      });
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  static fetchByName(name) {
    return foods.find((f) => f.name === name);
  }

  static fetchById(id) {
    return foods.find((f) => f.id === id);
  }

  static fetchAll() {
    return foods;
  }

  //extracts id and name properties and creates a new object with {id, name}
  static fetchAllNames() {
    return foods.map((f) => ({ id: f.id, name: f.name }));
  }
};
