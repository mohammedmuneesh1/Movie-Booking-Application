import type { Document } from "mongoose";
import mongoose from "mongoose";


interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
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
  rawEvent?: object;
}



const paymentSchema = new mongoose.Schema(
  {
    booking:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
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