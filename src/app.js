import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./db.js";
import seatsRouter from "./routes/seats.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();
app.use(express.json());
app.use("/api/seats", seatsRouter);
app.use("/api/reservations", reservationsRouter);

app.get("/", (req, res) => {
    res.send("server connected!");
})

connectDB();

app.listen(3000, () => {
    console.log("server connected!");
})
