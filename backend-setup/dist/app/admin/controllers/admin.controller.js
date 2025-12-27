//=============================================  AN API TO CHECK IF HE IS ADMIN OR NOT START ============================================== 
import ResponseHandler from "../../../utils/responseHandler.js";
import { GET_ALL_BOOKINGS_SERVICE, GET_BOOKINGS_DATA_SERVICE } from "../../booking/services/booking.service.js";
import { GET_ALL_SHOWS_SERVICE } from "../../show/services/show.service.js";
import { GET_USER_COUNT_SERVICE } from "../../user/services/user.service.js";
import FavoriteModel from "../../favourite/models/favourite.schema.js";
import { TOP_10_FAVOURITE_MOVIES_SERVICE } from "../../favourite/services/favourite.service.js";
// /**
//  * @desc    put udpate user profile picture
//  * @route   PUT /api/profile/pic
//  * @access  Private
//  * @returns  user profile object
//  */
export async function IS_ADMIN(req, res) {
    return ResponseHandler(res, 200, true, { isAdmin: true }, 'Admin apprroved successfully');
}
//=============================================  AN API TO CHECK IF HE IS ADMIN OR NOT END ============================================== 
export async function GET_DASHBOARD__DATA_CONTROLLER(req, res) {
    const [bookingData, activeShowData, userCount, top10Favourite] = await Promise.all([
        GET_BOOKINGS_DATA_SERVICE(),
        GET_ALL_SHOWS_SERVICE(),
        GET_USER_COUNT_SERVICE(),
        TOP_10_FAVOURITE_MOVIES_SERVICE(),
    ]);
    //👉 Most favorited movies across all users
    const dashboardData = {
        totalBookings: bookingData.length,
        activeShows: activeShowData,
        totalRevenue: bookingData.reduce((total, booking) => total + booking.amount, 0),
        userCount: userCount,
        userFavouriteMovies: top10Favourite,
    };
    return ResponseHandler(res, 200, true, dashboardData, 'Dashboard data fetched successfully');
}
//API TO GET ALL SHOWS 
export async function ADMIN_GET_ALL_SHOWS_CONTROLLER(req, res) {
    const shows = await GET_ALL_SHOWS_SERVICE();
    return ResponseHandler(res, 200, true, shows, 'Shows fetched successfully.');
}
//API TO GET ALL BOOKING 
export async function GET_ALL_BOOKINGS_CONTROLLER(req, res) {
    const bookingData = await GET_ALL_BOOKINGS_SERVICE();
    return ResponseHandler(res, 200, true, bookingData, 'Bookings fetched successfully.');
}
//# sourceMappingURL=admin.controller.js.map