const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: {
      type: String,
      required: false
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
    safeForConditions: {
      type: Array,
      required: false
    },
    notRecommendedForConditions: {
      type: Array,
      required: false
    },
    recommendedForCyclePhases: {
      type: Array,
      required: false
    },
    compatibleWithDiets: {
      type: Array,
      required: false
    },
    linkToImage: {
      type: String,
      required: false
    }
  });