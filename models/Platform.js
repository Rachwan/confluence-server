import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Platform = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    activeColor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Platform", Platform);
