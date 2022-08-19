import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({
    name: {
        type: String,
        required: true
    },
    officialName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    safeForConditions: {
        type: String,
        required: false
    },
});