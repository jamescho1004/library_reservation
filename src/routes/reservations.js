import { Router } from "express";
import Reservation from "../models/Reservation.js";
import Seat from "../models/Seat.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { seatId, startTime, endTime } = req.body;

        const seat = await Seat.findById(seatId);
        if(!seat) return res.status(404).json({ error: "seat not found"});

        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);

        if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) 
            return res.status(400).json({ error: "Invalid datetime format" });
    
        if(newStart >= newEnd) return res.status(400).json({ error: "Invalid time range"});

        const conflict = await Reservation.findOne({
        seat: seatId,
        startTime: { $lt: newEnd },
        endTime: { $gt: newStart },
        });

        if (conflict) 
            return res.status(409).json({error: "Seat already reserved for this time"});

        const reservation = await Reservation.create({
            seat: seatId,
            startTime: newStart,
            endTime: newEnd
        })

        res.status(201).json(reservation);
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
})

export default router;