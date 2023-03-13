import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add many-to-many references to other schemas
export default new Schema({
    name: {
        type: String,
        required: true
    },
    alternativeName: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: [
            'Big',
            'Small'
        ],
        required: false
    },
    linkToImage: {
        type: String,
        required: false
    }
}, { collection: 'activities.muscles' });