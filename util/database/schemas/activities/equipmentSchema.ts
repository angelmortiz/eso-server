import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//TODO: Add many-to-many references to other schemas
export default new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    alternativeName: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    linkToImage: {
      type: String,
      required: false,
    },
    linkToThumbnail: {
      type: String,
      required: false,
    },
  },
  { collection: 'activities.equipments' }
);
