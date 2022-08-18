const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chronicConditionSubSchema = new Schema({
  conditionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  conditionName: {
    type: String,
    required: true
  }
}, {_id: false});

const dietSubSchema = new Schema({
  dietId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  dietName: {
    type: String,
    required: true
  }
}, {_id: false});

module.exports = new Schema({
  name: {
    type: String,
    required: true
  },
  classification: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainMacronutrient: {
    type: String,
    required: true
  },
  secondaryMacronutrient: {
    type: String,
    required: true
  },
  nutritionFacts: {
    type: Array,
    required: false
  },
  mealType: {
    type: Array,
    required: true
  },
  micronutrientDensity: {
    type: String,
    required: true
  },
  safeForConditions:{
    type: [chronicConditionSubSchema],
    required: false
  },
  notRecommendedForConditions: {
    type: [chronicConditionSubSchema],
    required: false
  },
  recommendedForCyclePhases: {
    type: Array,
    required: false
  },
  compatibleWithDiets: {
    type: [dietSubSchema],
    required: true
  },
  linkToImage: {
    type: String,
    required: false
  }
  });