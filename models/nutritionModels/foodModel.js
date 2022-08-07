const { ObjectId } = require('mongodb');
const getDb = require('../../util/database').getNutritionDb;

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
    return db
      .collection('foods')
      .insertOne(this)
      .then((result) => {
        console.log('New data inserted successfully.', result);
      })
      .catch((error) => {
        console.log('There was an error trying to insert new data.', error);
      });
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  static fetchByName(name) {
    const db = getDb();
    return db
      .collection('foods')
      .findOne({name: name})
      .then((product) => {
        return product;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchById(id) {
    const db = getDb();
    return db
      .collection('foods')
      .findOne({_id:  new ObjectId(id)})
      .then((product) => {
        return product;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('foods')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //extracts id and name properties and creates a new object with {id, name}
  static fetchAllNames() {
    const db = getDb();
    return db
      .collection('foods')
      .find({}, {projection:{name: 1}})
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static foodStaticValues = {
    classification: ['Vegetal', 'Fruta', 'Carne', 'Especie', 'Bebida'],
    macronutrients: ['Proteína', 'Grasa', 'Carbohidrato'],
    micronutrientDensity: ['Bajo', 'Medio', 'Alto'],
    menstrualPhases: ['Menstruación', 'Folicular', 'Ovulación', 'Lútea']
  }
};