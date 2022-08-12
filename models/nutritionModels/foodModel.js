const ObjectId = require('mongodb').ObjectId;
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
  compatibleWithDiets;
  linkToImage;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  save() {
    const db = getDb();
    delete this.id; //removes property before inserting to db to prevent double id to be created
    return db
      .collection('foods')
      .insertOne(this)
      .then((result) => {
        console.log('New document inserted successfully.', result);
        return result;
      })
      .catch((error) => {
        console.log('There was an error trying to insert new document.', error);
        return error;
      });
  }

  update() {
    const db = getDb();
    const selectDocument = {"_id": new ObjectId(this.id)};
    delete this.id; //removes property before inserting to db to prevent double id to be created

    return db
      .collection('foods')
      .updateOne(selectDocument, { $set: this })
      .then((result) => {
        console.log('Document updated successfully.', result);
        return result;
      })
      .catch((error) => {
        console.log('There was an error trying to update the document.', error);
        return error;
      });
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
        return error;
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
        return error;
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
        return error;
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
        return error;
      });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection('foods')
      .deleteOne({_id: new ObjectId(id)})
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  static foodSelectOptions = {
    classification: ['Vegetal', 'Fruta', 'Carne', 'Especie', 'Bebida'],
    macronutrients: ['Proteína', 'Grasa', 'Carbohidrato'],
    micronutrientDensity: ['Bajo', 'Medio', 'Alto']
  }
};