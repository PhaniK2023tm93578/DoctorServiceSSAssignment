import { pingMongodb } from "./db/index.js";
import express from "express";
import { Doctor } from "./db/models/Doctor.js";
import { DoctorTimeSlot } from "./db/models/DoctorTimeSlot.js";

const app = express();
app.use(express.json({ limit: "20mb" }));

// Replace with your MongoDB connection details

app.post("/doctor/bookslot", async (req, res) => {
  const { doctorId, timeSlot } = req.body;

  try {
    // Check if the doctor exists
    const doctor = await Doctor.findOne({ _id: doctorId });

    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    // Check if the time slot is available
    const existingTimeSlot = await DoctorTimeSlot.findOne({
      doctorId,
      timeSlot,
      isAvailable: true,
    });

    if (!existingTimeSlot) {
      return res.status(404).json({ error: "Time slot not available" });
    }

    // Update the time slot to be unavailable
    await DoctorTimeSlot.updateOne(
      { _id: existingTimeSlot._id },
      { $set: { isAvailable: false } }
    );

    res.json({
      message: "Appointment booked successfully",
      appointmentDetails: {
        name: doctor.name,
        specialization: doctor.specialization,
        fees: doctor.fees,
        timeSlot,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to cancel an appointment

app.delete("/doctor/cancel-slot-booking/:timeSlotId", async (req, res) => {
  const { timeSlotId } = req.params;

  try {
    // Update the time slot to be available

    await DoctorTimeSlot.updateOne(
      { _id: timeSlotId },
      { $set: { isAvailable: true } }
    );

    res.json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to create doctor time slot
app.post("/doctor/timeslot", async (req, res) => {
  const { timeSlot, isAvailable, doctorId } = req.body;

  try {
    // Update the time slot to be available
    await DoctorTimeSlot.insertMany([
      {
        doctorId,
        timeSlot,
        isAvailable,
      },
    ]);

    res.json({ message: "Doctor Time Slot created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/doctor", async (req, res) => {
  const { name, fees, specialization } = req.body;

  try {
    // Update the time slot to be available

    await Doctor.insertMany([
      {
        name,
        fees,
        specialization,
      },
    ]);

    res.json({ message: "Doctor created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/doctor/:id", async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findOne({ _id: id });
  res.status(200).json({ doctor });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
  await pingMongodb();

  console.log(`Server listening on port ${PORT}`);
});
