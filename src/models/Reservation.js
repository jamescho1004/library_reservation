import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
    {
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seat",
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    },
    {timestamp: true}
);

export default mongoose.model("Reservation", reservationSchema);
