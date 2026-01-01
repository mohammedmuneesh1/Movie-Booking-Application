import { Inngest } from "inngest";
import BookingModel from "../../app/booking/models/booking.schema.js";
import ShowModel from "../../app/show/models/show.schema.js";
import { sendEmail } from "../nodeMailerConfig.js";
import connectDB from "../db.js";
import mongoose from "mongoose";
/**
 * 1️⃣ Create Inngest client
 * This is REQUIRED. Inngest is NOT a function.
 */
// What is this? This creates your app’s Inngest client.
export const inngest = new Inngest({
    id: "movie-booking-app",
    eventKey: process.env.INNGEST_EVENT_KEY, // For SENDING events
    // Signing key is used automatically by the serve handler
});
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
export const releaseSeatsAndDeleteBookings = inngest.createFunction({ id: "release-seats-expires-booking" }, //uniquely identifies your app in Inngest,groups all workflows under one app,is used in the Inngest dashboard
{ event: "app.checkpayment" }, //“Run this workflow when an event named app.checkpayment is received.”  Example trigger (elsewhere in your code):
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
        const { bookingId } = event.data;
        const booking = await BookingModel
            .findById(bookingId)
            .populate("paymentId");
        // ❗ Already handled or paid
        if (!booking || booking.status !== "PENDING_PAYMENT") {
            return;
        }
        // Payment completed in time → do nothing
        if (booking.paymentId?.isPaid) {
            return;
        }
        const show = await ShowModel.findById(booking.show);
        if (!show)
            return;
        // ✅ Release seats (NO forEach + async bug)
        for (const seat of booking.bookedSeats) {
            delete show.occupiedSeats[seat];
        }
        show.markModified("occupiedSeats");
        await show.save();
        // ❗— MARK EXPIRED
        booking.status = "EXPIRED";
        await booking.save();
    });
});
export const sendBookingConfirmationEmail = inngest.createFunction({ id: "send-booking-confirmation-email" }, { event: "app.bookingConfirmationEemail" }, async ({ event, step }) => {
    const { bookingId } = event?.data;
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    const booking = await BookingModel.findById(bookingId).populate([
        {
            path: "show",
            populate: [{
                    path: "movieRef",
                    model: "Movie",
                }]
        }, {
            path: "user",
            model: "User",
        }
    ]);
    // sendEmail
    await sendEmail({
        to: booking?.user?.email,
        subject: `Booking confirmation for ${booking?.show?.movieRef?.title}`,
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, Helvetica, sans-serif;
      color: #e5e7eb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #020617;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .header {
      background: linear-gradient(135deg, #6366f1, #22d3ee);
      padding: 20px;
      text-align: center;
      color: #020617;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 24px;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
      color: #f8fafc;
    }
    .details {
      background-color: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .detail-row span {
      color: #94a3b8;
    }
    .detail-row strong {
      color: #e5e7eb;
      font-weight: 600;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #1e293b;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h1>🎬 Booking Confirmed</h1>
    </div>

    <div class="content">
      <h2>Hi ${booking?.user?.name},</h2>

      <p>
        Your booking has been <strong>successfully confirmed</strong>.
        Get ready to enjoy the show!
      </p>

      <div class="details">
        <div class="detail-row">
          <span>Movie</span>
          <strong>${booking?.show?.movieRef?.title}</strong>
        </div>

        <div class="detail-row">
          <span>Date & Time</span>
          <strong>
            ${new Date(booking?.show?.showDateTime).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
        })}
          </strong>
        </div>

        <div class="detail-row">
          <span>Seats</span>
          <strong>${booking?.bookedSeats?.join(", ")}</strong>
        </div>

        <div class="detail-row">
          <span>Total Tickets</span>
          <strong>${booking?.bookedSeats?.length}</strong>
        </div>

        <div class="detail-row">
          <span>Booking ID</span>
          <strong>${booking?._id}</strong>
        </div>
      </div>

      <p>
        Please arrive at least <strong>15 minutes early</strong> to avoid last-minute hassle.
      </p>

      <p>
        Enjoy your movie experience 🍿<br/>
        <strong>QuickShow Team</strong>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} QuickShow. All rights reserved.<br/>
      This is an automated email. Please do not reply.
    </div>

  </div>
</body>
</html>`,
    });
    console.log("Inngest triggered: send-booking-confirmation-email");
});
//# sourceMappingURL=ingestFunction.js.map