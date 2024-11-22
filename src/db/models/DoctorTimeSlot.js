import mongoose from "mongoose";

export const doctorTimeSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "doctor",
    },
    timeSlot: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
    },
  },
  {
    collection: "doctorTimeSlot",
    timestamps: true,
  }
);

export const DoctorTimeSlot = mongoose.model(
  "doctorTimeSlot",
  doctorTimeSlotSchema
);
