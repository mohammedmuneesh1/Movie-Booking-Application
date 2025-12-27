//FUNCTION TO CHECK AVAILABILITY OF SELECTED SEATS FOR A MOVIE 
import ResponseHandler from "../../../utils/responseHandler.js";
import ShowModel from "../../show/models/show.schema.js";
import BookingModel from "../models/booking.schema.js";
import { GET_ALL_BOOKINGS_SERVICE } from "../services/booking.service.js";
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
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;
    //It tells you where the request came from (scheme + domain + port).
    //Origin: http://localhost:3000
    //1)  check if the seat is available for the selected show
    if (!selectedSeats.length) {
        return ResponseHandler(res, 200, false, null, 'Please select at least one seat.');
    }
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
        return ResponseHandler(res, 200, false, null, 'Selected seats are already taken. Please select another seat.');
    }
    //GET SHOW DETAILS
    const showData = await ShowModel.findById(showId).populate("movieRef");
    //CREATE A NEW BOOKING 
    const booking = await BookingModel.create({
        user: userId,
        show: showId,
        amount: showData?.showPrice * selectedSeats.length || 0,
        bookedSeats: selectedSeats,
    });
    //after creating booking, we have to reserve this seats 
    selectedSeats.forEach((seat) => {
        showData.occupiedSeats[seat] = userId;
    });
    showData.markModified('occupiedSeats');
    //When markModified() IS needed (important) ❌ Plain object / Mixed type 
    //mutating a nested object, not reassigning it, using a dynamic key (seat)
    await showData.save();
    // ⚠️⚠️ STRIPE GATEWAY INTIALIZE (PENDING) ⚠️⚠️
    return ResponseHandler(res, 200, true, booking, 'Booking created successfully.');
}
/**
 * @desc    get occupied seats
 * @route   GET /api/bookings/occupied-seata ⚠️
 * @access  Private  ⚠️
 * @returns  object of occupied seats  ⚠️
 */
export async function GET_ALL_OCCUPIED_SEATS_BY_SHOWID(req, res) {
    const { showId } = req.params;
    const showData = await ShowModel.findById(showId).populate("movieRef");
    const occupiedSeats = Object.keys(showData?.occupiedSeats);
    return ResponseHandler(res, 200, true, occupiedSeats, 'Occupied seats fetched successfully.');
}
export async function GET_ALL_BOOKINGS_CONTROLLER_B1(req, res) {
    const bookingData = await GET_ALL_BOOKINGS_SERVICE();
    return ResponseHandler(res, 200, true, bookingData, 'Bookings fetched successfully.');
}
//# sourceMappingURL=booking.controller.js.map