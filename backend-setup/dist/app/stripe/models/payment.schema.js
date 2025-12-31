import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    paymentLink: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        enum: ["stripe"],
        required: true,
    },
    paymentIntentId: {
        type: String,
        //   unique: true,
    },
    paymentExpireMinute: {
        type: String,
        required: true,
    },
    paymentExpiresOn: {
        type: Date,
        required: true
    },
    paymentCustomUniqueId: {
        type: String,
        unique: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    checkoutSessionId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    currency: String,
    status: {
        type: String,
        enum: ["pending", "succeeded", "failed", "refunded"],
        default: "pending",
    },
}, { timestamps: true });
const PaymentModel = mongoose.models.payment || mongoose.model("Payment", paymentSchema);
export default PaymentModel;
//# sourceMappingURL=payment.schema.js.map