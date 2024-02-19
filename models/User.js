import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    number: {
      type: Number,
    },
    profile: {
      type: String,
    },
    background: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "influencer", "business"],
      default: "influencer",
    },
    platforms: [
      {
        platformId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Platform",
        },
        followers: {
          type: Number,
          required: true,
        },
      },
    ],
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", User);
