import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add references to other schemas once they're added
const ExerciseSubSchema = new Schema({
    exerciseId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    exerciseName: {
      type: String,
      required: true
    }
  }, {_id: false});

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
    exercises: {
        type: [ExerciseSubSchema],
        required: false
    },
    linkToImage: {
        type: String,
        required: false
    }
}, { collection: 'activities.muscles' });