import stripe from 'stripe';
import ResponseHandler from '../../../utils/responseHandler.js';
import BookingModel from '../../booking/models/booking.schema.js';
import PaymentModel from '../models/payment.schema.js';
import mongoose from 'mongoose';
import connectDB from '../../../config/db.js';
export const stripeWebHooks = async (request, response) => {
    console.log('stripeWebHooks called');
    // ✅ SAFETY NET FOR WEBHOOK (required)
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY); //1
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET); //2
    }
    catch (error) {
        return ResponseHandler(response, 200, false, null, `Stripe webhook error. ${error instanceof Error ? error.message : error}`);
    }
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                    limit: 1,
                });
                //BOTH ARE SAME 
                // paymentIntent.id → "pi_123"
                // session.payment_intent → "pi_123"
                const session = sessionList.data[0];
                const { bookingId, paymentCustomUniqueId, userId } = session?.metadata;
                if (!bookingId || !paymentCustomUniqueId || !userId)
                    return ResponseHandler(response, 200, false, null, 'stripe webhook error:Booking id not found || paymentCustomUniqueId not found || userId not found.');
                const payment = await PaymentModel.findOneAndUpdate({
                    paymentCustomUniqueId: paymentCustomUniqueId,
                    userId: userId,
                }, {
                    status: "succeeded",
                    isPaid: true,
                    paymentIntentId: session?.payment_intent,
                }, {
                    new: true,
                });
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
        return ResponseHandler(response, 200, true, { received: true }, 'stripe webhook success');
    }
    catch (error) {
        console.error('`Webhook processing error:', error);
        return ResponseHandler(response, 200, false, null, 'stripe webhook processing error');
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