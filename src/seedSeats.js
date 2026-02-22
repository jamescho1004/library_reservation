// db 초기화
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Seat from "./models/Seat.js";


async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("DB connect failed", err);
  }

  await Seat.deleteMany({});
  console.log("Seat deleted");

  const zoneCounts = { A: 50, B: 40, C: 30, D: 50 };
  const seats = [];
  for (const [zone, count] of Object.entries(zoneCounts)) {
    for (let i=1; i<=count; i++) {
        seats.push({zone, number: i});
    }
  }

  await Seat.insertMany(seats);
  console.log("seats seeded");

  await mongoose.disconnect();
  console.log("DB disconnected");
}   

seed().catch((e) => {
    console.log("seats seed err");
    process.exit(1);
})