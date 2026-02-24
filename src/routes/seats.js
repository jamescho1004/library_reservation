import { Router } from "express";
import Seat from "../models/Seat.js";
import Reservation from "../models/Reservation.js";

const router = Router();

router.get("/status", async (req, res) => {
    try {
        const { zone, startTime, endTime } = req.query;

        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);

        if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) 
            return res.status(400).json({ error: "Invalid datetime format" });
    
        if(newStart >= newEnd) return res.status(400).json({ error: "Invalid time range"});

        const seatFilter = zone ? { zone } : {};
        const seats = await Seat.find(seatFilter).sort({ zone: 1, number: 1 });

        const reservedSeats = await Reservation.find({
        startTime: { $lt: newEnd },
        endTime: { $gt: newStart },
        }).select("seat");

        const reservedSeatsId = new Set(reservedSeats.map(r => r.seat.toString()));

        const result = seats.map(s => ({
            _id: s._id,
            zone: s.zone, 
            number: s.number,
            available: !reservedSeatsId.has(s._id.toString())
        }));

        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
})

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