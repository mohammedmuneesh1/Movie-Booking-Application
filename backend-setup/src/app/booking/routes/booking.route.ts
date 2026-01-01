

import express from 'express';
import isAuth from '../../../middlewares/isAuth.js';
import tryCatch from '../../../middlewares/tryCatch.js';
import { CREATE_BOOKING_CONTROLLER, GET_ALL_BOOKINGS_CONTROLLER_B1, GET_ALL_OCCUPIED_SEATS_BY_SHOWID, GET_ALL_USER_BOOKINGS_CONTROLLER } from '../controller/booking.controller.js';


const router = express.Router();
router.route('/create').post(isAuth,tryCatch(CREATE_BOOKING_CONTROLLER));
//api helps to get occupied seats, used on the seat layout page 
router.route('/seats/:showId').get(isAuth,tryCatch(GET_ALL_OCCUPIED_SEATS_BY_SHOWID));
router.route('/all/bookings').get(isAuth,tryCatch(GET_ALL_BOOKINGS_CONTROLLER_B1));
router.route('/user/bookings').get(isAuth,tryCatch(GET_ALL_USER_BOOKINGS_CONTROLLER));



export default router;