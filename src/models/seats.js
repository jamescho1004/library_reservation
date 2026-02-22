import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
    {
    zone: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
    },
    {timestamp: true}
)

seatSchema.index({ zone: 1, number: 1 }, { unique: true });

export default mongoose.model("Seat", seatSchema);