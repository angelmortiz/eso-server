import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SetLogs = new Schema({
  setNumber: {
    type: Number,
    required: [true, 'Set number is required.'],
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required.'],
  },
  reps: {
    type: Number,
    required: [true, 'Reps are required.'],
  },
  rir: {
    type: Number,
    required: false,
  },
});

const ExerciseLogs = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Exercise id is required.'],
  },
  isCompleted: {
    type: Boolean,
    required: [true, 'ExerciseLogs "isCompleted" flag is required'],
    default: false,
  },
  completedOn: {
    type: Date,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  sets: {
    type: [SetLogs],
    required: false,
  },
});

const WorkoutLogs = new Schema({
  workoutId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Workout id is required.'],
  },
  isCompleted: {
    type: Boolean,
    required: [true, 'WorkoutLogs "isCompleted" flag is required'],
    default: false,
  },
  completedOn: {
    type: Date,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  exercises: {
    type: [ExerciseLogs],
    required: false,
  },
});

export default new Schema({
  programId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Program id is required.'],
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
  isStarted: {
    type: Boolean,
    required: [true, 'ProgramHistory "isStarted" flag is required'],
    default: false,
  },
  startedOn: {
    type: Date,
    required: false,
  },
  isCompleted: {
    type: Boolean,
    required: [true, 'ProgramHistory "isCompleted" flag is required'],
    default: false,
  },
  completedOn: {
    type: Date,
    required: false,
  },
  workoutLogs: {
    type: [WorkoutLogs],
    required: false,
  },
});
