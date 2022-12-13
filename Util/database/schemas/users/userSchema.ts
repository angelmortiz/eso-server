const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    email:  {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,  'Please, enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    role: {
        type: String,
        emun: ['user', 'editor', 'admin'],
        default: 'user'
    },
    imageLink: {
        type: String,
        required: false
    }
});

//Schema save middleware
UserSchema.pre('save', async function(this: typeof UserSchema, next) {
    //only runs when the password has been modified
    if (!this.isModified('password')) return next();

    //hashing password before saving into the db
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.validatePassword = async function(inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
}

UserSchema.methods.hasChangedPasswordAfterJwtCreation = function(JwtTimestamp) {
    if (!this.passwordChangedAt) return false;

    const changedTimestamp = Math.round(this.passwordChangedAt.getTime()/1000);
    return JwtTimestamp < changedTimestamp;
}

UserSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpiresAt = Date.now() + 15 * 60 * 60 * 1000; //15 mins
    return resetToken;
}

export default UserSchema;