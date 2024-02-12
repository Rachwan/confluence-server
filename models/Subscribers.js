import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Subscribers = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscribers", Subscribers);
