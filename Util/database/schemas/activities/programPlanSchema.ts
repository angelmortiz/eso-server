import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
    type: [Schema.Types.ObjectId],
    ref: 'Workout',
    required: false,
  },
});

const WeekPlanSchema = new Schema({
  weekNumber: {
    type: Number,
    required: [true, 'Week number is required.'],
    min: 1,
    unique: true
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
