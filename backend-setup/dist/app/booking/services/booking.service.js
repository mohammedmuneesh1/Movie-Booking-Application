import BookingModel from "../models/booking.schema.js";
export async function GET_BOOKINGS_DATA_SERVICE() {
    const bookings = await BookingModel.find({ isPaid: true });
    return bookings;
}
export async function GET_ALL_BOOKINGS_SERVICE() {
    const bookings = await BookingModel.find({}).populate([
        {
            path: 'show',
            populate: [{
                    path: 'movieRef',
                    model: 'Movie',
                }]
        }, {
            path: 'paymentId',
            model: 'Payment',
        }
    ]).sort({ createdAt: -1 });
    return bookings;
}
export async function GET_ALL_BOOKINGS_BY_USER_ID_SERVICE(userId) {
    const bookingData = await BookingModel.find({ user: userId }).populate([{
            path: 'show',
            populate: [{
                    path: 'movieRef',
                    model: 'Movie',
                }]
        }]).sort({ createdAt: -1 });
    console.log('bookingData', bookingData);
    return bookingData;
}
//# sourceMappingURL=booking.service.js.map