import type { Document } from "mongoose";
import mongoose from "mongoose";


interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  userId?:string;
  paymentLink: string;
  provider: "stripe";
  paymentIntentId?: string;
  checkoutSessionId?: string;
  amount: number;
  paymentExpireMinute: string;
  paymentExpiresOn: Date;
  isPaid: boolean;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  refundMessage?:string;
  refundId?:string;
  rawEvent?: mongoose.Schema.Types.Mixed;
  refundInitiatedAt?:Date,

}



const paymentSchema = new mongoose.Schema(
  {
    booking:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    paymentLink:{
        type:String,
        required:true,
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
    paymentExpireMinute:{
        type:String,
        required:true,
    },
    paymentExpiresOn:{
        type:Date,
        required:true
    },
    paymentCustomUniqueId:{
        type:String,
        unique:true
    },
    rawEvent: {
  type: mongoose.Schema.Types.Mixed,
},
refundMessage:{
  type:String,
},
refundId:{
  type:String,
},
refundInitiatedAt : {
    type:Date,
},

  isPaid:{
            type:Boolean,
            default:false
    },
    checkoutSessionId:{
        type:String,
    },
    amount:{
        type:Number,
        required:true
    },
    currency: String,
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.models.payment || mongoose.model<IPayment>("Payment",paymentSchema);
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