const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

export default new Schema({
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
        required: [true, 'Password field is required'],
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'Password confirmation field is required']
    },
    imageLink: {
        type: String,
        required: false
    }
});