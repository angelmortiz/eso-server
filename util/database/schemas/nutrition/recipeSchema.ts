import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add references to other schemas once they're added
const foodSubSchema = new Schema(
  {
    foodId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chronicConditionSubSchema = new Schema(
  {
    conditionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    conditionName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const dietSubSchema = new Schema(
  {
    dietId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    dietName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

export default new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    preparationTime: {
      type: Number,
      required: false,
    },
    complexity: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },
    nutritionFacts: {
      type: Array,
      required: false,
    },
    mealType: {
      type: Array,
      required: false,
    },
    ingredients: {
      type: [foodSubSchema],
      required: false,
    },
    instructions: {
      type: Array,
      required: false,
    },
    utensils: {
      type: Array,
      required: false,
    },
    safeForConditions: {
      type: [chronicConditionSubSchema],
      required: false,
    },
    notRecommendedForConditions: {
      type: [chronicConditionSubSchema],
      required: false,
    },
    recommendedForCyclePhases: {
      type: Array,
      required: false,
    },
    compatibleWithDiets: {
      type: [dietSubSchema],
      required: false,
    },
    linkToImage: {
      type: String,
      required: false,
    },
    linkToThumbnail: {
      type: String,
      required: false,
    },
    linkToVideo: {
      type: String,
      required: false,
    },
  },
  { collection: 'nutrition.recipes' }
);
