import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Soon = new Schema(
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

export default mongoose.model("Soon", Soon);
