import mongoose, { Document, Types } from "mongoose";

interface IBooking extends Document {
  user: string;
  show: string;
  bookedSeats: string[];
  paymentId: Types.ObjectId;
  status: string;
  expiresAt: Date;
  ispersonalEmailReminderSent: boolean;
  personalEmailReminderSentAt?: Date;
  personalEmailRminderScheduledFor?: Date;

}

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "CONFIRMED", "EXPIRED", "CANCELLED"],
      default: "PENDING_PAYMENT",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ispersonalEmailReminderSent:{
      type: Boolean,
      default: false
    },
    personalEmailReminderSentAt:{
      type: Date,
    },
    personalEmailRminderScheduledFor:{
      type: Date
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    bookedSeats: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const BookingModel =
  mongoose.models.booking || mongoose.model<IBooking>("Booking", bookingSchema);
export default BookingModel;
