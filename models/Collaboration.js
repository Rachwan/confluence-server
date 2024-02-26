import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Collaboration = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    platforms: {
      type: [String],
      required: true,
    },
    firstImage: {
      type: String,
      required: true,
    },
    secondImage: {
      type: String,
      required: true,
    },
    thirdImage: {
      type: String,
      required: true,
    },
    fourthImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    additional: {
      type: [
        {
          name: { type: String },
          detail: { type: String },
        },
      ],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collaboration", Collaboration);
