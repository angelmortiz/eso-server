import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StatusLogSchema = new Schema({
  isStarted: {
    type: Boolean,
    required: [true, 'Log "isStarted" is required.'],
    default: false,
  },
  startedOn: {
    type: Date,
    required: false,
  },
  isCompleted: {
    type: Boolean,
    required: [true, 'Log "isCompleted" is required.'],
    default: false,
  },
  completedOn: {
    type: Date,
    required: false,
  },
  isSkipped: {
    type: Boolean,
    required: [true, 'Log "isSkipped" is required.'],
    default: false,
  },
  skippedOn: {
    type: Date,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

const SetLogSchema = new Schema({
  log: {
    type: StatusLogSchema,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  reps: {
    type: Number,
    required: true,
    min: 0,
  },
  rir: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

const ExerciseLogSchema = new Schema({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
  },
  log: StatusLogSchema,
  sets: {
    type: [SetLogSchema],
    required: false,
  },
});

const WorkoutLogSchema = new Schema({
  workout: {
    type: Schema.Types.ObjectId,
    ref: 'Workout',
  },
  log: StatusLogSchema,
  exercises: {
    type: [ExerciseLogSchema],
    required: false,
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

const WeeksLogSchema = new Schema({
  weekNumber: {
    type: Number,
    required: [true, 'Week number is required.'],
    min: 1,
  },
  workouts: {
    type: [WorkoutLogSchema],
    required: false,
  },
});

export default new Schema({
  log: StatusLogSchema,
  weeksLog: [WeeksLogSchema],
});
