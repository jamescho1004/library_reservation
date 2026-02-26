import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import seatsRouter from "./routes/seats.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/seats", seatsRouter);
app.use("/api/reservations", reservationsRouter);

connectDB();

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/reserve", (req, res) => {
  res.render("reserve");
});

app.listen(3000, () => {
  console.log("server connected!");
});
