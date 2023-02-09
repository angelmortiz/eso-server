import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserBasicInfo = new Schema({
  birthday: {
    type: Date,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  sex: {
    type: String,
    required: false,
    enum: ['Male', 'Female', 'Other'],
  },
}, {_id: false});

export default new Schema(
  {
    basicInfo: {
      type: UserBasicInfo,
      required: false,
    },
    mainGoal: {
      type: String,
      required: false,
      enum: ['Lose fat', 'Build muscle', 'Maintain'],
    },
  },
  { collection: 'users.info' }
);
