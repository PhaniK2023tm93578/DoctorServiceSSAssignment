import mongoose from "mongoose";

export const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
  },
  {
    collection: "doctor",
    timestamps: true,
  }
);

export const Doctor = mongoose.model("doctor", doctorSchema);
