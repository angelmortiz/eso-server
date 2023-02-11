import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add many-to-many references to other schemas (equipment, muscles)
export default new Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is a required field.'],
    },
    alternativeName: {
      type: String,
      required: false,
    },
    difficulty: {
      type: String,
      required: false,
    },
    types: {
      type: [String],
      required: false,
    },
    compoundMovement: {
      type: Boolean,
      required: [true, 'Compound movement option is a required field.'],
    },
    mainMuscle: {
      type: Schema.Types.ObjectId,
      required: [true, 'Main muscle name is a required field.'],
      ref: "Muscle"
    },
    secondaryMuscles: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "Muscle"
    },
    equipments: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "Equipment"
    },
    safeForConditions: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "PhysicalCondition"
    },
    notRecommendedForConditions: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "PhysicalCondition"
    },
    recommendedForCyclePhases: {
      type: [String],
      required: false,
    },
    linkToVideo: {
      type: String,
      required: false,
    },
    linkToImage: {
      type: String,
      required: false,
    },
  },
  { collection: 'activities.exercises' }
);
