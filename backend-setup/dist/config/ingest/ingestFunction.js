import { Inngest } from "inngest";
import BookingModel from "../../app/booking/models/booking.schema.js";
import ShowModel from "../../app/show/models/show.schema.js";
import { sendEmail } from "../nodeMailerConfig.js";
import connectDB from "../db.js";
import mongoose from "mongoose";
import UserModel from "../../app/user/models/user.schema.js";
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
    // ⏳ Wait 10 minutes (CORRECT WAY)
    await step.sleep("wait-for-10-minutes", "10m");
    //"10m" → 10 minutes, "1h" → 1 hour, "30s" → 30 seconds , "1d" → 1 day
    //“Persist the workflow state, stop executing now, and resume this exact workflow after 10 minutes, even if the server crashes or restarts.”
    // 🔍 Check payment & cleanup
    await step.run("check-payment-status", async () => {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
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
export const sendBookingConfirmationEmail = inngest.createFunction({ id: "send-booking-confirmation-email" }, { event: "app.bookingConfirmationEmail" }, async ({ event, step }) => {
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
    //   // sendEmail
    await sendEmail({
        // to:booking?.user?.email,
        to: "mblogx4u@gmail.com",
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

    /* 🔹 FORCE PURE WHITE TEXT */
    .white-text {
      color: #ffffff;
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

      <p class="white-text">
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

      <p class="white-text">
        Please arrive at least <strong>15 minutes early</strong> to avoid last-minute hassle.
      </p>

      <p class="white-text">
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
</html>`
    });
});
//JUST 8 HOURS REMINDER FUNCTION CRON
export const sendShowReminders = inngest.createFunction({ id: 'send-show-reminders' }, // Unique ID for this Inngest function
{ cron: '0 */8 * * *' }, // Runs every 8 hours (at minute 0: 00:00, 08:00, 16:00)
async ({ step }) => {
    // ✅ ADD: Ensure database connection (critical for serverless)
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    // Calculate time windows for finding shows
    const now = new Date(); // Current time
    const windowEnd = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours from now
    // ============================================================
    // STEP 1: Prepare reminder tasks (fetch shows and users)
    // ============================================================
    // 🤔 WHY step.run()? 
    // - Inngest tracks each step separately for observability
    // - If this step fails, Inngest can retry just this step
    // - You can see in dashboard exactly which step failed
    // - Steps are idempotent and can be replayed
    //prepare reminder tasks 
    const { reminderTasks, showCount } = await step.run('prepare-reminder-tasks', // Step name (shows in Inngest dashboard)
    async () => {
        // Query shows within the time window
        const shows = await ShowModel.find({
            // ❌ ISSUE: Your schema likely uses 'showDateTime', not 'showTime'
            showDateTime: {
                $gte: now, // Shows starting after now
                $lte: windowEnd
            } // Shows starting within 8 hours
        }).populate([
            {
                path: 'movieRef',
                model: 'Movie',
            }
        ]);
        // Array to store all reminder tasks
        const tasks = [];
        for (const show of shows) {
            // Skip if movie or seat data is missing
            if (!show.movieRef || !show.occupiedSeats) {
                continue;
            }
            // Extract unique user IDs from occupied seats
            // occupiedSeats format: { "A1": "userId1", "A2": "userId2", ... }
            const userIds = [...new Set(Object.values(show.occupiedSeats))];
            if (userIds.length === 0) {
                continue;
            }
            const users = await UserModel.find({
                _id: { $in: userIds }
            }).select('name email');
            for (const user of users) {
                tasks.push({
                    userEmail: user?.email,
                    userName: user?.name,
                    movieTitle: show?.movieRef?.title,
                    showDateTime: show?.showDateTime // When the show starts
                });
            }
        }
        // Return tasks array (this becomes the value of reminderTasks)
        return { reminderTasks: tasks, showCount: shows.length };
    });
    // If no reminders to send, exit early
    if (reminderTasks.length === 0) {
        return { sent: 0, message: 'No reminders to send ' };
    }
    //send reminder emails 
    // ============================================================
    // STEP 2: Send all reminder emails
    // ============================================================
    const results = await step.run('send-all-reminders', // Step name
    async () => {
        // Promise.allSettled runs all promises and returns results (doesn't throw on failure)
        return await Promise.allSettled(reminderTasks.map((tData) => {
            return sendEmail({
                to: tData?.userEmail,
                subject: `Reminder: ${tData?.movieTitle} at ${new Date(tData?.showDateTime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                })}`,
                body: reminderEmailTemplate(tData) //HTML TEMPLATE 
            });
        }));
    });
    // Count successful and failed emails
    const sent = results.filter(r => r.status === 'fulfilled').length;
    // const failed = results.filter(r=>r.status === 'rejected').length;
    const failed = results.length - sent;
    // // Mark as sent
    // booking.reminderSent = true;
    // booking.reminderSentAt = new Date();
    // await booking.save();
    // ✅ OPTIONAL: Mark reminders as sent in booking/show records
    // You might want to track this to avoid duplicate reminders
    // await step.run('mark-reminders-sent', async () => {
    //   await ShowModel.updateMany(
    //     { _id: { $in: shows.map(s => s._id) } },
    //     { reminderSent: true, reminderSentAt: new Date() }
    //   );
    // });
    return {
        sent,
        failed,
        totalShows: showCount,
        totalReminders: reminderTasks.length,
        message: `${sent} reminders sent, ${failed} reminders failed`
    };
    // await sendShowRemindersEmail();
});
export const sendNewShowNotifications = inngest.createFunction({ id: 'send-new-show-notifications' }, { event: 'new-show-added' }, // every 12 hours 
async ({ event, step }) => {
    const { movieTitle } = event.data;
    // const users = await UserModel.find({});
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    // ✅ STEP 2: Fetch  users
    const users = await step.run('fetch-users', async () => {
        // Only fetch users who want notifications (add this field to User schema)
        const allUsers = await UserModel.find({
        // emailNotifications: true, // Optional: only users who opted in
        }).select('email name');
        return allUsers;
    });
    // ✅ STEP 3: Send emails in parallel with Promise.allSettled
    const results = await step.run('send-all-notifications', async () => {
        return await Promise.allSettled(users.map((user) => {
            return sendEmail({
                to: user.email,
                subject: `New Show Added: ${movieTitle}`,
                body: newShowAddedEmailTemplate({
                    movieTitle,
                    userEmail: user.email,
                    userName: user.name,
                }),
            });
        }));
    });
    // ✅ STEP 4: Count results
    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    // ✅ STEP 5: Log failed emails 
    if (failed > 0) {
        console.error(`❌ ${failed} emails failed:`);
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed for ${users[index].email}:`, result.reason);
            }
        });
    }
    // for (const user of users){
    //   const userEmail = user.email;
    //   const userName= user.name;
    //   const subject = `New Show Added: ${movieTitle}`;
    //   const body = newShowAddedEmailTemplate({movieTitle,userEmail,userName});
    //   await sendEmail({
    //     to:userEmail,
    //     subject,
    //     body
    //   })
    // }
    return {
        sent,
        failed,
        totalUsers: users.length,
        message: `${sent} notifications sent, ${failed} failed`,
    };
});
// PERSONAL TWO HOUR REMINDER
export const sendPersonalShowReminder = inngest.createFunction({ id: "send-scheduled-show-reminder" }, { event: "app.scheduleShowReminder" }, async ({ event, step }) => {
    try {
        const { bookingId, scheduledFor } = event.data;
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        console.info(`🔔 Processing reminder for booking ${bookingId}`);
        // ============================================================
        // STEP 1: Calculate delay and sleep until reminder time
        // ============================================================
        const now = new Date();
        const reminderTime = new Date(scheduledFor);
        const delayMs = reminderTime.getTime() - now.getTime();
        if (delayMs > 0) {
            // console.log(`⏰ Sleeping for ${Math.round(delayMs / 1000 / 60)} minutes`);
            await step.sleep("wait-until-reminder-time", delayMs);
        }
        else {
            console.info("⚠️ Reminder time already passed, sending immediately");
        }
        // ============================================================
        // STEP 2: Fetch booking and validate
        // ============================================================
        const booking = await step.run("fetch-booking-details", async () => {
            if (mongoose.connection.readyState !== 1) {
                await connectDB();
            }
            return await BookingModel.findById(bookingId)
                .populate([
                {
                    path: "show",
                    populate: [{ path: "movieRef", model: "Movie" }],
                },
                { path: "user", model: "User" },
            ])
                .lean();
        });
        // Validate booking still exists and is confirmed
        if (!booking) {
            console.warn(`⚠️ Booking ${bookingId} not found`);
            return { success: false, reason: "booking_not_found" };
        }
        if (booking.status !== "CONFIRMED") {
            console.info(`⚠️ Booking ${bookingId} not confirmed (status: ${booking.status})`);
            return { success: false, reason: "booking_not_confirmed" };
        }
        // Check if reminder already sent
        if (booking.reminderSent) {
            console.info(`⚠️ Reminder already sent for booking ${bookingId}`);
            return { success: false, reason: "already_sent" };
        }
        // ============================================================
        // STEP 3: Send reminder email
        // ============================================================
        await step.run("send-reminder-email", async () => {
            const showTime = new Date(booking.show.showDateTime);
            const hoursUntilShow = Math.round((showTime.getTime() - Date.now()) / (1000 * 60 * 60));
            await sendEmail({
                to: booking.user.email,
                subject: `⏰ Reminder: ${booking.show.movieRef.title} starts in ${hoursUntilShow} hours!`,
                body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Movie Reminder</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, sans-serif;
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
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      padding: 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 24px;
    }
    .alert-box {
      background: #7c2d12;
      border-left: 4px solid #ef4444;
      padding: 16px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
    }
    .details {
      background-color: #1e293b;
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
      <h1>🎬 Your Movie Starts Soon!</h1>
    </div>

    <div class="content">
      <h2>Hi ${booking.user.name},</h2>

      <div class="alert-box">
        ⏰ Your movie starts in ${hoursUntilShow} hours!
      </div>

      <p>Don't forget about your upcoming show:</p>

      <div class="details">
        <div class="detail-row">
          <span>Movie</span>
          <strong>${booking.show.movieRef.title}</strong>
        </div>

        <div class="detail-row">
          <span>Show Time</span>
          <strong>
            ${showTime.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                })}
          </strong>
        </div>

        <div class="detail-row">
          <span>Your Seats</span>
          <strong>${booking.bookedSeats?.join(", ")}</strong>
        </div>

        <div class="detail-row">
          <span>Booking ID</span>
          <strong>${booking._id}</strong>
        </div>
      </div>

      <p>
        <strong>⚠️ Please arrive 15-20 minutes early</strong> to collect your tickets and find your seats.
      </p>

      <p>
        See you at the movies! 🍿🎬<br/>
        <strong>QuickShow Team</strong>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} QuickShow. All rights reserved.
    </div>
  </div>
</body>
</html>`,
            });
            console.info(`✅ Reminder email sent to ${booking.user.email}`);
        });
        // ============================================================
        // STEP 4: Mark reminder as sent
        // ============================================================
        await step.run("mark-reminder-sent", async () => {
            await BookingModel.findByIdAndUpdate(bookingId, {
                ispersonalEmailReminderSent: true,
                personalEmailReminderSentAt: new Date(),
                reminderScheduledFor: scheduledFor,
            });
        });
        return {
            success: true,
            bookingId,
            emailSentTo: booking.user.email,
            showTime: booking.show.showDateTime,
        };
    }
    catch (error) {
        console.error("❌ Error in sendScheduledShowReminder:", error);
        throw error; // Let Inngest retry
    }
});
export function reminderEmailTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Movie Reminder</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .text {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .highlight {
      background-color: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="title">
      🎬 Movie Reminder
    </div>

    <div class="text">
      Hi <strong>${data.userName}</strong>,
    </div>

    <div class="text">
      This is a quick reminder for your upcoming movie:
    </div>

    <div class="highlight">
      <strong>${data.movieTitle}</strong><br/>
      ${new Date(data.showDateTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    })}
    </div>

    <div class="text" style="margin-top:16px;">
      Please arrive at least <strong>15 minutes early</strong> so you don’t miss the opening.
    </div>

    <div class="text">
      Enjoy the show 🍿<br/>
      <strong>QuickShow Team</strong>
    </div>

    <div class="footer">
      This is an automated reminder. No reply needed.
    </div>

  </div>
</body>
</html>
`;
}
export function newShowAddedEmailTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Show Added</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    .text {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 14px;
    }
    .highlight {
      background-color: #f9fafb;
      padding: 12px;
      border-left: 4px solid #2563eb;
      margin: 16px 0;
      font-size: 14px;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="title">
      🎬 New Show Available
    </div>

    <div class="text">
      Hi <strong>${data.userName}</strong>,
    </div>

    <div class="text">
      Good news! A new show has just been added for a movie you might be interested in.
    </div>

    <div class="highlight">
      <strong>${data.movieTitle}</strong><br/>
      Tickets are now available for booking.
    </div>

    <div class="text">
      Open the app to check show timings and book your seats before they fill up.
    </div>

    <div class="text">
      See you at the movies 🍿<br/>
      <strong>QuickShow Team</strong>
    </div>

    <div class="footer">
      This email was sent to ${data.userEmail}<br/>
      You’re receiving this because you subscribed to movie updates.
    </div>

  </div>
</body>
</html>
`;
}
export function movieReminderEmailTemplate(params) {
    const { userName, movieTitle, showTime, bookedSeats, bookingId, hoursUntilShow, } = params;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Movie Reminder</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, sans-serif;
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
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      padding: 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 24px;
    }
    .alert-box {
      background: #7c2d12;
      border-left: 4px solid #ef4444;
      padding: 16px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
    }
    .details {
      background-color: #1e293b;
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
      <h1>🎬 Your Movie Starts Soon!</h1>
    </div>

    <div class="content">
      <h2>Hi ${userName},</h2>

      <div class="alert-box">
        ⏰ Your movie starts in ${hoursUntilShow} hours!
      </div>

      <p>Don't forget about your upcoming show:</p>

      <div class="details">
        <div class="detail-row">
          <span>Movie</span>
          <strong>${movieTitle}</strong>
        </div>

        <div class="detail-row">
          <span>Show Time</span>
          <strong>
            ${showTime.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    })}
          </strong>
        </div>

        <div class="detail-row">
          <span>Your Seats</span>
          <strong>${bookedSeats.join(", ")}</strong>
        </div>

        <div class="detail-row">
          <span>Booking ID</span>
          <strong>${bookingId}</strong>
        </div>
      </div>

      <p>
        <strong>⚠️ Please arrive 15–20 minutes early</strong> to collect your tickets and find your seats.
      </p>

      <p>
        See you at the movies! 🍿🎬<br/>
        <strong>QuickShow Team</strong>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} QuickShow. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}
// Why Use step.run()?
// You CAN write code outside step.run(), but you SHOULD use it. Here's why:
//# sourceMappingURL=ingestFunction.js.map