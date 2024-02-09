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
    images: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    singleTitle: {
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
