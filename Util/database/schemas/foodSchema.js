const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
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
    required: true
  },
  linkToImage: {
    type: String,
    required: false
  }
  });