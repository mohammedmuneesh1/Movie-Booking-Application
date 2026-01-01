import type { Request, Response } from 'express';
import stripe from 'stripe';
import ResponseHandler from '../../../utils/responseHandler.js';
import BookingModel from '../../booking/models/booking.schema.js';
import PaymentModel from '../models/payment.schema.js';
import mongoose from 'mongoose';
import connectDB from '../../../config/db.js';


export const stripeWebHooks = async (request:Request,response:Response)=>{
    
    console.log('stripeWebHooks called');
    
  // ✅ SAFETY NET FOR WEBHOOK (required)
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }


    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY as string); //1
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body,sig as string,process.env.STRIPE_WEBHOOK_SECRET as string); //2
    } catch (error) {
        return ResponseHandler(response,500,false,null,`Stripe webhook error. ${error instanceof Error ? error.message: error}`);
    }


    try {

        switch(event.type){
   
            case "payment_intent.succeeded":{

                const paymentIntent = event.data.object as stripe.PaymentIntent;

                const sessionList = await stripeInstance.checkout.sessions.list({ // 1 USE stripInstance check the bottom output
                    payment_intent:paymentIntent.id,
                    limit:1,
                });

                 //BOTH ARE SAME 
                // paymentIntent.id → "pi_123"
                // session.payment_intent → "pi_123"
                
                const session = sessionList.data[0];
                const {bookingId,paymentCustomUniqueId,userId } = session?.metadata as {bookingId:string,paymentCustomUniqueId:string,userId:string};

                if(!bookingId || !paymentCustomUniqueId || !userId) return ResponseHandler(response,200,false,null,'stripe webhook error:Booking id not found || paymentCustomUniqueId not found || userId not found.');

                const booking = await BookingModel.findById(bookingId);


 //IF NOT BOOKING FOUND , DONT TRIGGER REFUND INSTEAD WAIT FOR USER TO APPRAOCH YOU  AND CHECK STRIPE RAW EVENT ON PAYMENT MODEL TO RECLAIM REFUND(DO THE REFUND MANUALLY )

                if(!booking){
 // 🚨 serious data integrity issue
// DO NOT auto-refund silently
await PaymentModel.findOneAndUpdate(
  { paymentCustomUniqueId },
  {
    status: "failed",
    rawEvent: event,
  }
);

// Log + alert, let admin investigate
return ResponseHandler(response,500,false,null,"Booking not found for successful payment");
                    

                }
                  //IF PAYMENT IS EXPIRED , THEN SEND BACK THE PAYMENT REFUND START





                if (booking.status === "EXPIRED" || booking.status === "CANCELLED") {


     // ✅ Legit late payment → refund
    await stripeInstance.refunds.create({
      payment_intent: session?.payment_intent as string,
    });



    await PaymentModel.findOneAndUpdate(
      { paymentCustomUniqueId },
      {
        status: "refunded",
        isPaid: false,
        paymentIntentId: session?.payment_intent,
      }
    );

    return ResponseHandler(response,200,false,null,'Booking Expired. Payment Refunded.');
           }

                //IF PAYMENT IS EXPIRED , THEN SEND BACK THE PAYMENT REFUND END


                const payment = await PaymentModel.findOneAndUpdate(
                    {
                    paymentCustomUniqueId:paymentCustomUniqueId,
                    userId:userId,
                },
                { 
                    status: "succeeded",
                    isPaid: true,
                      paymentIntentId:session?.payment_intent as string, 
                },{
                    new:true,
                }
                );

                booking.status = "CONFIRMED";
                await booking.save();

                break;
            }
    
             default:
                console.log(`Unhandled event type ${event.type}`);
                break;    
        }
        return ResponseHandler(response,200,true,{received:true},'stripe webhook success');
    } catch (error) {
        console.error('`Webhook processing error:',error);
        return ResponseHandler(response,200,false,null,'stripe webhook processing error');
    }
}




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



















