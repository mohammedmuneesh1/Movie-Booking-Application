import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    rawEvent: {
        type: mongoose.Schema.Types.Mixed,
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
//RAW EVENT WILL BE LOOK LIKE THIS 
// {
//   "id": "evt_1QabcXYZ",
//   "type": "checkout.session.completed",
//   "created": 1767263952,
//   "data": {
//     "object": {
//       "id": "cs_test_123",
//       "payment_intent": "pi_123",
//       "metadata": {
//         "bookingId": "66c8f...",
//         "paymentCustomUniqueId": "9c9d..."
//       },
//       "amount_total": 45000,
//       "currency": "usd"
//     }
//   }
// }
//# sourceMappingURL=payment.schema.js.map