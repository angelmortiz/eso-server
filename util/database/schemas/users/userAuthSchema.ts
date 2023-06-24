import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const Schema = mongoose.Schema;

const UserAuthSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name field is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name field is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name field is required'],
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please, enter a valid email'],
    },
    password: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    profileId: String,
    strategy: {
      type: String,
      required: [true, 'Strategy is required']
    },
    role: {
      type: String,
      emun: ['User', 'Editor', 'Admin'],
      default: 'User',
    },
    imageLink: {
      type: String,
      required: false,
    },
    userInfo: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'UserInfo',
      unique: true,
      sparse: true
    },
  },
  { collection: 'users.auth' }
);

//Hashes passwords before saving into db
UserAuthSchema.pre('save', async function (next) {
  //only runs when the password has been modified
  if (!this.isModified('password')) return next();

  //hashing password before saving into the db
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date(Date.now() - 1000); //prevents problem with the time jwt is created
  next();
});

UserAuthSchema.methods.validatePassword = async function (
  inputPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, this.password);
};

UserAuthSchema.methods.hasChangedPasswordAfterJwtCreation = function (
  JwtTimestamp
) {
  if (!this.passwordChangedAt) return false;

  const changedTimestamp = Math.round(this.passwordChangedAt.getTime() / 1000);
  return JwtTimestamp < changedTimestamp;
};

UserAuthSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpiresAt = Date.now() + 15 * 60 * 1000; //15 mins
  return resetToken;
};

export default UserAuthSchema;
