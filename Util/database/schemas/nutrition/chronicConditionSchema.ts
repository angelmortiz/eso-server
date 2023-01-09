import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    symptoms: {
        type: [String],
        required: false
    },
    causes: {
        type: [String],
        required: false
    },
    treatments: {
        type: [String],
        required: false
    },
    tests: {
        type: [String],
        required: false
    },
}, { collection: 'nutrition.chronicConditions' });