import { Inngest } from "inngest";
import BookingModel from "../../app/booking/models/booking.schema.js";
import ShowModel from "../../app/show/models/show.schema.js";

/**
 * 1️⃣ Create Inngest client
 * This is REQUIRED. Inngest is NOT a function.
 */
// What is this? This creates your app’s Inngest client.
export const inngest = new Inngest({
  id: "movie-booking-app",
    eventKey: process.env.INNGEST_EVENT_KEY as string,  // For SENDING events
  // Signing key is used automatically by the serve handler
});

/**
 * Event payload type
 */
type CheckPaymentEvent = {
  bookingId: string;
};

/**
 * 2️⃣ Inngest function:
 * - waits 10 minutes
 * - checks payment
 * - releases seats
 * - deletes booking if unpaid
 */

// What is createFunction?
// This defines a workflow.


//can pause, can resume, can retry, can be replayed safely




export const releaseSeatsAndDeleteBookings = inngest.createFunction(
  { id: "release-seats-delete-booking" }, //uniquely identifies your app in Inngest,groups all workflows under one app,is used in the Inngest dashboard
  { event: "app.checkpayment" },  //“Run this workflow when an event named app.checkpayment is received.”  Example trigger (elsewhere in your code):

  //somewhere in our code    await inngest.send({ name: "app.checkpayment", data: {      bookingId: booking._id.toString(),   },});



  async ({ event, step }) => {
    console.log("Inngest triggered: releaseSeatsAndDeleteBookings");

    // ⏳ Wait 10 minutes (CORRECT WAY)
    await step.sleep("wait-for-10-minutes", "10m");

    //"10m" → 10 minutes, "1h" → 1 hour, "30s" → 30 seconds , "1d" → 1 day

    //“Persist the workflow state, stop executing now, and resume this exact workflow after 10 minutes, even if the server crashes or restarts.”
    // 🔍 Check payment & cleanup
    await step.run("check-payment-status", async () => {

        console.log("satuff tirggerred ");
      const { bookingId } = event.data as CheckPaymentEvent;

      const booking = await BookingModel
        .findById(bookingId)
        .populate("paymentId");

      // Booking deleted or already paid → exit safely
      if (!booking || booking.paymentId?.isPaid) {
        return;
      }

      const show = await ShowModel.findById(booking.show);
      if (!show) return;

      // ✅ Release seats (NO forEach + async bug)
      for (const seat of booking.bookedSeats) {
        delete show.occupiedSeats[seat];
      }

      show.markModified("occupiedSeats");
      await show.save();

      // ❌ Delete booking
      await BookingModel.findByIdAndDelete(booking._id);
    });
  }
);
