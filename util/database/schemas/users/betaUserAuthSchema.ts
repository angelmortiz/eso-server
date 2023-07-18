import mongoose from 'mongoose';
import validator from 'validator';
const Schema = mongoose.Schema;

const BetaUserAuthSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    strategy: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please, enter a valid email'],
    },
    profileId: {
      type: String,
      required: false,
      unique: true,
    },
    userAuth: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'UserAuth',
      unique: true,
      sparse: true,
    },
  },
  { collection: 'users.betaAuth' }
);

export default BetaUserAuthSchema;
