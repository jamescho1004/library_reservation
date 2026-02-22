import { Router } from "express";
import Seat from "../models/Seat.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const seats = await Seat.find().sort({zone: 1, number: 1});
        res.json(seats);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch seats" });
    }
})

export default router;