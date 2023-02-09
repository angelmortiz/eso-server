import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ExercisePlanSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Exercise id is required.'],
  },
  exercise: {
    type: Schema.Types.ObjectId,
    ref: 'activities.exercises',
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

const WorkoutPlanSchema = new Schema({
  workoutId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Workout id is required.'],
  },
  workout: {
    type: Schema.Types.ObjectId,
    ref: 'activities.workouts',
  },
  name: {
    type: String,
    required: [true, 'Workout name is required.'],
  },
  exercisesPlan: {
    type: [ExercisePlanSchema],
    required: false,
  },
});

const DayPlanSchema = new Schema({
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
  workoutPlan: {
    type: [WorkoutPlanSchema],
    required: false,
  },
});

const WeekPlanSchema = new Schema({
  weekNumber: {
    type: Number,
    required: [true, 'Week number is required.'],
    min: 1,
  },
  daysPlan: {
    type: [DayPlanSchema],
    required: false,
  },
});

export default new Schema(
  {
    program: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'UserAuth',
    },
    assignedOn: {
      type: Date,
      required: [true, 'Assignation date is required.'],
      default: Date.now(),
    },
      assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'UserAuth',
    },
    weeksPlan: {
      type: [WeekPlanSchema],
      required: false,
    },
  },
  { collection: 'activities.programPlans' }
);
