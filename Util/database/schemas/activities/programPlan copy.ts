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

const WorkoutPlanSchema = new Schema({
  workoutId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Workout id is required.'],
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
    programId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Program id is required.'],
    },
    name: {
      type: String,
      required: [true, 'Workout name is required.'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      required: [true, 'Program has to be assigned to an user id.'],
    },
    assignedOn: {
      type: Date,
      required: [true, 'Assignation date is required.'],
      default: Date.now(),
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'Id of the user who assigned the program is required.'],
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
    weeksPlan: {
      type: [WeekPlanSchema],
      required: false,
    },
  },
  { collection: 'activities.programPlan' }
);
