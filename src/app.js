import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./db.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("server connected!");
})

connectDB();

app.listen(3000, () => {
    console.log("server connected!");
})
