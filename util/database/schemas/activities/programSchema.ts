import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const WorkoutPlanSchema = new Schema({
  workout: {
    type: Schema.Types.ObjectId,
    required: [true, 'Workout id is required.'],
    ref: 'Workout',
  },
  dayNumber: {
    type: Number,
    required: false,
    min: 1,
    max: 7,
  },
  dayOfTheWeek: {
    type: String,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thrusday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: false,
  },
});

export default new Schema(
  {
    name: {
      type: String,
      required: [true, 'Program name is required.'],
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ['Strength', 'Hypertrophy', 'Endurance', 'Mixed'],
      required: [true, 'Program type is required.'],
    },
    sequence: {
      type: String,
      enum: ['Weekly', 'Cycle'],
      required: [
        true,
        'Program sequence is required. Please, choose between weekly or cycle.',
      ],
    },
    duration: {
      type: Number,
      required: true,
    },
    linkToImage: {
      type: String,
      required: false,
    },
    linkToThumbnail: {
      type: String,
      required: false,
    },
    workouts: {
      type: [WorkoutPlanSchema],
      required: false,
    },
  },
  { collection: 'activities.programs' }
);
