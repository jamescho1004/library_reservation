import { Router } from "express";
import Seat from "../models/Seat.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { zone } = req.query;
        const filter = zone ? { zone } : {}; 
        const seats = await Seat.find(filter).sort({zone: 1, number: 1});
        res.json(seats);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch seats" });
    }
})

router.get("/:zone/:number", async (req, res) => {
    try {
        const { zone, number } = req.params;
        const seat = await Seat.findOne({ zone, number: Number(number)});
        if(!seat) res.status(404).json({ error: "seat not found!" });
        res.json(seat);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch seats" });
    }
})

export default router;