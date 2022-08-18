const { nutritionDb } = require('../../util/database/connection');
const FoodSchema = require('../../util/database/schemas/foodSchema');
const FoodModel = nutritionDb.model('Food', FoodSchema);

exports.FoodHandler = class FoodHandler {
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
    if (!inputValues) return; //if no values were provided, do not map
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  save() {
    return new FoodModel(this)
    .save()
    .then((result) => {
      console.log('New document inserted successfully.');
      return result._id.toString();
    })
    .catch((error) => {
      console.log('There was an error trying to insert new document.', error);
      return error;
    });
  }

  update() {
    return FoodModel
    .updateOne({_id: this.id}, this)
    .then((result) => {
      console.log('Document updated successfully.', result);
      return result;
    })
    .catch((error) => {
      console.log('There was an error trying to update the document.', error);
      return error;
    });
  }
  
  static fetchByName(foodName) {
    return FoodModel
    .findOne({name: foodName})
    .then((product) => {
      return product;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static fetchById(id) {
    return FoodModel
    .findById(id)
    .then((product) => {
      return product;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static fetchAll() {
    return FoodModel
    .find()
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
    return FoodModel
    .find({}, 'name')
    .then((products) => {
      return products;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static deleteById(id) {
    return FoodModel
    .findByIdAndDelete(id)
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