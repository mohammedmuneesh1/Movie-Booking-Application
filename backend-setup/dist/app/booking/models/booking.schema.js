import mongoose, { Document } from "mongoose";
;
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bookedSeats: {
        type: Array,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentLink: {
        type: String,
    }
}, {
    timestamps: true,
    minimize: false
});
const BookingModel = mongoose.models.booking || mongoose.model('Booking', bookingSchema);
export default BookingModel;
//# sourceMappingURL=booking.schema.js.map