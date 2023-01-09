import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add references to other schemas once they're added
const MuscleSubSchema = new Schema({
  muscleId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  muscleName: {
    type: String,
    required: true
  }
}, {_id: false});

const EquipmentSubSchema = new Schema({
  equipmentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  equipmentName: {
    type: String,
    required: true
  }
}, {_id: false});

const PhysicalConditionSubSchema = new Schema({
  conditionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  conditionName: {
    type: String,
    required: true
  }
}, {_id: false});

export default new Schema({
  name: {
    type: String,
    required: true
  },
  alternativeName: {
    type: String,
    required: false
  },
  difficulty: {
    type: String,
    required: false
  },
  types: {
    type: [String],
    required: false
  },
  compoundMovement: {
    type: Boolean,
    required: true
  },
  mainMuscle: {
    type: MuscleSubSchema,
    required: true
  },
  secondaryMuscles: {
    type: [MuscleSubSchema],
    required: false
  },
  equipments:{
    type: [EquipmentSubSchema],
    required: false
  },
  safeForConditions:{
    type: [PhysicalConditionSubSchema],
    required: false
  },
  notRecommendedForConditions: {
    type: [PhysicalConditionSubSchema],
    required: false
  },
  recommendedForCyclePhases: {
    type: [String],
    required: false
  },
  linkToVideo: {
    type: String,
    required: false
  },
  linkToImage: {
    type: String,
    required: false
  }
  }, { collection: 'activities.exercises' });