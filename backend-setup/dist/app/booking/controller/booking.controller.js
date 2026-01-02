//FUNCTION TO CHECK AVAILABILITY OF SELECTED SEATS FOR A MOVIE 
import ResponseHandler from "../../../utils/responseHandler.js";
import ShowModel from "../../show/models/show.schema.js";
import BookingModel from "../models/booking.schema.js";
import { GET_ALL_BOOKINGS_SERVICE, GET_ALL_USER_BOOKINGS_SERVICE } from "../services/booking.service.js";
import stripe from 'stripe';
import mongoose from "mongoose";
import PaymentModel from "../../stripe/models/payment.schema.js";
import { v4 as uuidv4 } from "uuid";
import { inngest } from "../../../config/ingest/ingestFunction.js";
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await ShowModel.findById(showId);
        if (!showData)
            return false;
        const occupiedSeats = showData?.occupiedSeats || {};
        //checking if any seats taken 
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        //here some will return true, if taken 
        return !isAnySeatTaken; //if true -> false (seat not not available  )
    }
    catch (error) {
        console.error('Error in checkSeatsAvailability:', error);
        return false;
    }
};
/**
 * @desc    POST HELPS USER TO REGISTER A SEAT (BOOKING)
 * @route   GET /api/bookings/create ⚠️
 * @access  Private  ⚠️
 * @returns  booking object of db  ⚠️
 */
export async function CREATE_BOOKING_CONTROLLER(req, res) {
    const userId = req.user?.id;
    if (!userId) {
        return ResponseHandler(res, 401, false, null, "Please login first to book tickets");
    }
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;
    //It tells you where the request came from (scheme + domain + port).
    //Origin: http://localhost:3000
    if (!selectedSeats?.length) {
        return ResponseHandler(res, 200, false, null, "Please select at least one seat.");
    }
    const mongoSession = await mongoose.startSession();
    try {
        mongoSession.startTransaction();
        //1)  check if the seat is available for the selected show
        // 1️⃣ Check seat availability
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable) {
            throw new Error("Selected seats are already taken");
        }
        // 2️⃣ Get show (inside transaction)
        const showData = await ShowModel.findById(showId)
            .populate("movieRef")
            .session(mongoSession);
        if (!showData) {
            throw new Error("Show not found");
        }
        const stripePaymentExpiresOnSeconds = Math.floor(Date.now() / 1000) + 30 * 60; //30 minute 
        //==================================
        //⚠️⚠️⚠️⚠️⚠️ :STIRPE REQUIRED MINIMUM 30 MINUTE VALIDATION 
        //==================================
        // THERE
        //“Take the current time (in seconds since 1970), then add 1800 seconds (30 minutes).” 
        //30 * 60 = 1800 seconds
        const bookingExpirationTime = new Date(Date.now() + 10 * 60 * 1000);
        const paymentExpiresOnDate = new Date(stripePaymentExpiresOnSeconds * 1000);
        //* 1000  -->  seconds * 1000 -> milliseconds 
        // 3️⃣ Create booking
        const booking = await BookingModel.create([
            {
                user: userId,
                show: showId,
                bookedSeats: selectedSeats,
                expiresAt: bookingExpirationTime,
            },
        ], { session: mongoSession });
        // 4️⃣ Lock seats
        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        });
        showData.markModified("occupiedSeats");
        await showData.save({ session: mongoSession });
        // 5️⃣ Stripe checkout session (outside DB, but inside try)
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const productData = {
            name: `${showData.movieRef.title} Movie`,
        };
        if (showData.movieRef.description?.trim()) {
            productData.description = showData.movieRef.description;
        }
        // console.log('paymentExpiresOn',stripePaymentExpiresOnSeconds);
        // console.log('paymentExpiresOnDate',paymentExpiresOnDate);
        const paymentCustomUniqueId = uuidv4();
        const payAmount = showData.showPrice * selectedSeats.length;
        const stripePaymentAmount = payAmount * 100; //*100 is required (convert to paise, OR CENTS IN STRIPE , PAISE FOR INR)
        const stripeSession = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/?next=/user/dashboard/bookings`,
            cancel_url: `${origin}/user/dashboard/bookings`,
            mode: "payment",
            expires_at: stripePaymentExpiresOnSeconds,
            metadata: {
                bookingId: booking[0]._id.toString(),
                paymentCustomUniqueId,
                userId,
            },
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: stripePaymentAmount,
                        product_data: productData,
                    },
                    quantity: 1,
                },
            ],
        });
        const payment = await PaymentModel.create([
            {
                booking: booking[0]._id,
                paymentLink: stripeSession.url,
                provider: "stripe",
                paymentUrl: stripeSession.url,
                paymentCustomUniqueId,
                paymentExpireMinute: "30 M",
                paymentExpiresOn: paymentExpiresOnDate,
                //   paymentIntentId: stripeSession.payment_intent as string, initially payment_intent will be null
                checkoutSessionId: stripeSession.id,
                amount: payAmount,
                currency: "usd",
                status: "pending",
            },
        ], { session: mongoSession });
        // 6️⃣ saving payment id also to booking 
        booking[0].paymentId = payment[0]._id;
        await booking[0].save({ session: mongoSession });
        // ✅ Commit only if EVERYTHING worked
        await mongoSession.commitTransaction();
        mongoSession.endSession();
        try {
            await inngest.send({
                name: "app.checkpayment",
                data: { bookingId: booking[0]._id.toString() },
            });
        }
        catch (inngestError) {
            // Log but don't fail the request - booking is already saved
            console.error("Inngest send failed:", inngestError);
        }
        return ResponseHandler(res, 200, true, { url: stripeSession.url }, "Booking created successfully");
    }
    catch (error) {
        // 🔥 Rollback EVERYTHING
        await mongoSession.abortTransaction();
        mongoSession.endSession();
        console.error("BOOKING TRANSACTION FAILED:", error);
        return ResponseHandler(res, 500, false, null, error.message || "Booking failed");
    }
}
/**
 * @desc    get occupied seats
 * @route   GET /api/bookings/occupied-seata ⚠️
 * @access  Private  ⚠️
 * @returns  object of occupied seats  ⚠️
 */
export async function GET_ALL_OCCUPIED_SEATS_BY_SHOWID(req, res) {
    const { showId } = req.params;
    const showData = await ShowModel.findById(showId).populate([
        {
            path: 'movieRef',
            model: 'Movie',
        },
    ]);
    const occupiedSeats = Object.keys(showData?.occupiedSeats);
    return ResponseHandler(res, 200, true, occupiedSeats, 'Occupied seats fetched successfully.');
}
export async function GET_ALL_BOOKINGS_CONTROLLER_B1(req, res) {
    const bookingData = await GET_ALL_BOOKINGS_SERVICE();
    return ResponseHandler(res, 200, true, bookingData, 'Bookings fetched successfully.');
}
export async function GET_ALL_USER_BOOKINGS_CONTROLLER(req, res) {
    const userId = req.user?.id;
    const bookingData = await GET_ALL_USER_BOOKINGS_SERVICE(userId);
    return ResponseHandler(res, 200, true, bookingData, 'Bookings fetched successfully.');
}
//# sourceMappingURL=booking.controller.js.map