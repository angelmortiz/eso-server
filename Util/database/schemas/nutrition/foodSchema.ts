import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add references to other schemas once they're added
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

export default new Schema({
  name: {
    type: String,
    required: true
  },
  classification: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  mainMacronutrient: {
    type: String,
    required: false
  },
  secondaryMacronutrient: {
    type: String,
    required: false
  },
  nutritionFacts: {
    type: Array,
    required: false
  },
  mealType: {
    type: Array,
    required: false
  },
  micronutrientDensity: {
    type: String,
    required: false
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
    required: false
  },
  linkToImage: {
    type: String,
    required: false
  }
  });