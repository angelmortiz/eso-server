import mongoose from 'mongoose';
import { WorkoutPlanSchema } from './programSchema';
const Schema = mongoose.Schema;

const WeekPlanSchema = new Schema({
  weekNumber: {
    type: Number,
    required: [true, 'Week number is required.'],
    min: 1,
  },
  workouts: {
    type: [WorkoutPlanSchema],
    required: false,
  },
});

export default new Schema(
  {
    program: {
      type: Schema.Types.ObjectId,
      required: [true, 'Program is required.'],
      ref: 'Program',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      required: [true, 'Assigend to user is required.'],
      ref: 'UserAuth',
    },
    assignedOn: {
      type: Date,
      required: [true, 'Assignation date is required.'],
      default: Date.now(),
    },
      assignedBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'Assigend by user is required.'],
      ref: 'UserAuth',
    },
    weeksPlan: {
      type: [WeekPlanSchema],
      required: false,
    },
  },
  { collection: 'activities.programPlans' }
);
