import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add references to other schemas once they're added
const chronicConditionSubSchema = new Schema({
    conditionId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    conditionName: {
      type: String,
      required: true
    }
  }, {_id: false});
  
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
    safeForConditions:{
        type: [chronicConditionSubSchema],
        required: false
    },
});