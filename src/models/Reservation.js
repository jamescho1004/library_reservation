import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
    {
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
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
    {timestamps: true}
);

export default mongoose.model("Reservation", reservationSchema);
