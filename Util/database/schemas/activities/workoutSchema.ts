import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ExercisePlanSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Exercise id is required.'],
  },
  name: {
    type: String,
    required: [true, 'Exercise name is required.'],
  },
  sets: {
    type: [Number],
    required: [true, 'Sets value is required.'],
  },
  reps: {
    type: [Number],
    required: [true, 'Repetitions value is required.'],
  },
  tempo: {
    type: [Number],
    required: false,
  },
  rir: {
    type: [Number],
    required: false,
  },
  rest: {
    type: [Number],
    required: [true, 'Rest time is required.'],
  },
  superset: {
    type: Boolean,
    required: [true, 'Superset value is required.'],
    default: false,
  },
  supersetExercise: {
    type: Schema.Types.ObjectId,
    required: false,
  },
});

export default new Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required.'],
  },
  description: {
    type: String,
    required: false,
  },
  variant: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['Strength', 'Hypertrophy', 'Endurance'],
    required: [true, 'Workout type is required.'],
  },
  target: {
    type: String,
    enum: [
      'Full Body',
      'Upper Body',
      'Lower Body',
      'Front Muscles',
      'Back Muscles',
      'Mixed',
    ],
    required: false,
  },
  linkToImage: {
    type: String,
    required: false
  },
  exercises: {
    type: [ExercisePlanSchema],
    required: false
  }
}, { collection: 'activities.workouts' });
