import { ObjectId } from 'bson';
import { IFood } from "../../util/interfaces/nutritionInterfaces";
import { nutritionDb } from '../../util/database/connection';
import { ConditionIdAndName, DietnIdAndName } from '../../util/types/types';
import FoodSchema from '../../util/database/schemas/nutrition/foodSchema';

const FoodModel = nutritionDb.model('Food', FoodSchema);

export default class FoodHandler implements IFood {
  id: ObjectId | string;
  name: string;
  classification: string;
  description: string;
  mainMacronutrient: string;
  secondaryMacronutrient: string;
  nutritionFacts: object;
  mealType: string[];
  micronutrientDensity: string;
  safeForConditions: ConditionIdAndName[] | null;
  notRecommendedForConditions: ConditionIdAndName[] | null;
  recommendedForCyclePhases: string[] | null;
  compatibleWithDiets: DietnIdAndName[] | null;
  linkToImage: string;

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
  
  static fetchByName(name: string) {
    return FoodModel
    .findOne({name: name})
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static fetchById(id: string | ObjectId) {
    return FoodModel
    .findById(id)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static fetchAll() {
    return FoodModel
    .find()
    .then((responses) => {
      return responses;
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
    .then((responses) => {
      return responses;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static deleteById(id: string | ObjectId) {
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

  static foodStaticValues = {
    //TODO: DELETE ME AND FETCH FROM DB
    foods: [
      {_id: "", name: "-- Elige --"},
      {_id: "62fd50c7e64d23cd5690b26e", name: "Pechuga de pollo"},
      {_id: "62febe8b78e89b97e9fcb250", name: "Pechuga de pollo 2"}
    ]
}
};