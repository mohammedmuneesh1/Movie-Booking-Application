import stripe from "stripe";
import ResponseHandler from "../../../utils/responseHandler.js";
import BookingModel from "../../booking/models/booking.schema.js";
import PaymentModel from "../models/payment.schema.js";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import { inngest } from "../../../config/ingest/ingestFunction.js";
export const stripeWebHooks = async (request, response) => {
    // ✅ SAFETY NET FOR WEBHOOK (required)
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY); //1
    const sig = request.headers["stripe-signature"];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET); //2
    }
    catch (error) {
        return ResponseHandler(response, 500, false, null, `Stripe webhook error. ${error instanceof Error ? error.message : error}`);
    }
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    // 1 USE stripInstance check the bottom output
                    payment_intent: paymentIntent.id,
                    limit: 1,
                });
                //BOTH ARE SAME
                // paymentIntent.id → "pi_123"
                // session.payment_intent → "pi_123"
                const session = sessionList.data[0];
                const { bookingId, paymentCustomUniqueId, userId } = session?.metadata;
                if (!bookingId || !paymentCustomUniqueId || !userId) {
                    return ResponseHandler(response, 200, false, null, "stripe webhook error:Booking id not found || paymentCustomUniqueId not found || userId not found.");
                }
                const booking = await BookingModel.findById(bookingId);
                //IF NOT BOOKING FOUND , DONT TRIGGER REFUND INSTEAD WAIT FOR USER TO APPRAOCH YOU  AND CHECK STRIPE RAW EVENT ON PAYMENT MODEL TO RECLAIM REFUND(DO THE REFUND MANUALLY )
                //⚠️⚠️⚠️ SCENARIO-1 : IF BOOKING NOT FOUND(0.1% CHANCE FOR HAPPENING, BUT WHAT IF ?) ⚠️⚠️⚠️
                if (!booking) {
                    // 🚨 serious data integrity issue
                    // DO NOT auto-refund silently
                    await PaymentModel.findOneAndUpdate({ paymentCustomUniqueId }, {
                        status: "failed",
                        rawEvent: event,
                    });
                    // Log + alert, let admin investigate
                    return ResponseHandler(response, 500, false, null, "Booking not found for successful payment");
                }
                //IF PAYMENT IS EXPIRED , THEN SEND BACK THE PAYMENT REFUND START
                // ⚠️⚠️⚠️ SCENARIO-2: IF PAYMENT IS EXPIRED ⚠️⚠️⚠️
                if (booking.status === "EXPIRED" || booking.status === "CANCELLED") {
                    // ✅ Legit late payment → refund
                    const refund = await stripeInstance.refunds.create({
                        payment_intent: session?.payment_intent,
                    });
                    await PaymentModel.findOneAndUpdate({ paymentCustomUniqueId }, {
                        status: "refunded",
                        isPaid: false,
                        paymentIntentId: session?.payment_intent,
                        ...(refund.id && { refundId: refund.id }),
                        refundMessage: "Your booking expired before payment completed. Your payment has been refunded and will appear in your account within 1-10 business days.",
                    });
                    // ⚠️⚠️⚠️⚠️⚠️ TASK PENDING NOTIFICATION START //
                    //          // Send notification to user
                    // await sendRefundNotification({
                    //   userId,
                    //   bookingId,
                    //   message: "Oops! Your booking expired before payment completed. Don't worry - your payment has been automatically refunded.",
                    //   refundAmount: paymentIntent.amount / 100, // Convert from cents
                    //   estimatedRefundDays: "5-10 business days"
                    // });
                    return ResponseHandler(response, 200, true, null, "Booking Expired. Payment Refunded.");
                }
                //IF PAYMENT IS EXPIRED , THEN SEND BACK THE PAYMENT REFUND END
                const payment = await PaymentModel.findOneAndUpdate({
                    paymentCustomUniqueId: paymentCustomUniqueId,
                }, {
                    status: "succeeded",
                    isPaid: true,
                    paymentIntentId: session?.payment_intent,
                }, {
                    new: true,
                });
                booking.status = "CONFIRMED";
                await booking.save();
                // ============================================================
                // ✅ SCHEDULE REMINDER EMAIL - 2 HOURS BEFORE SHOW
                // ============================================================
                try {
                    const showTime = new Date(booking.show.showDateTime); //SUPPOSE SHOW TIME AT 16:00, THEN "reminderTime" WILL BE AT 14:00
                    const reminderTime = new Date(showTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
                    const now = new Date();
                    // Only schedule if show is more than 2 hours away
                    if (reminderTime > now) {
                        await inngest.send({
                            name: "app.scheduleShowReminder",
                            data: {
                                bookingId: booking._id.toString(),
                                userId: userId,
                                scheduledFor: reminderTime.toISOString(), //Converts the Date to UTC, Exactly what Inngest wants, sleepUntil() → UTC, toISOString() → UTC
                            },
                        });
                        console.info("✅ Reminder scheduled successfully");
                    }
                    else {
                    }
                }
                catch (reminderError) {
                    console.error("❌ Failed to schedule reminder:", reminderError);
                    // Don't fail the webhook - booking is still confirmed
                }
                //===============================================================
                // SEND CONFIRMATION EMAIL 
                //===============================================================
                try {
                    await inngest.send({
                        name: "app.bookingConfirmationEmail",
                        data: { bookingId },
                    });
                }
                catch (inngestError) {
                    // Log but don't fail the request - booking is already saved
                    console.error("Inngest send failed:", inngestError);
                }
                break;
            }
            default:
                console.info(`Unhandled event type ${event.type}`);
                break;
        }
        return ResponseHandler(response, 200, true, { received: true }, "stripe webhook success");
    }
    catch (error) {
        console.error("`Webhook processing error:", error);
        return ResponseHandler(response, 200, false, null, "stripe webhook processing error");
    }
};
// 1) const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY as string);
//the output may look like this
//  Stripe {
//   customers: { create, retrieve, update, list, ... },
//   paymentIntents: { create, retrieve, confirm, ... },
//   checkout: {
//     sessions: { create, retrieve, list }   // checkout.sessions.list
//   },
//   webhooks: { constructEvent },
//   refunds: { create, retrieve },
//   subscriptions: { create, cancel },
//   invoices: { retrieve, list },
//   ...
// }
// 2)  event = stripeInstance.webhooks.constructEvent(request.body,sig as string,process.env.STRIPE_WEBHOOK_SECRET as string);
//OUTPUT
// event = {
//   id: "evt_1NQxyzABC",
//   object: "event",
//   type: "payment_intent.succeeded",
//   data: {
//     object: { /* actual Stripe object */ }
//   },
//   created: 1710000000,
//   livemode: false,
//   pending_webhooks: 1,
//   request: {
//     id: "req_123",
//     idempotency_key: null
//   }
// }
//3 const sessionList = await stripeInstance.checkout.sessions.list({
//   payment_intent: paymentIntent.id,
//   limit: 1,
// });
//OUTPUT START
// {
//   "object": "list",
//   "data": [
//     {
//       "id": "cs_test_a1B2C3",
//       "object": "checkout.session",
//       "payment_intent": "pi_3NQxyzABC",
//       "amount_total": 50000,
//       "currency": "inr",
//       "payment_status": "paid",
//       "status": "complete",
//       "mode": "payment",
//       "metadata": {
//         "bookingId": "65fa91b1234567890abcd"
//       },
//       "created": 1710000000
//     }
//   ],
//   "has_more": false
// }
//# sourceMappingURL=stripe.webhooks.js.map