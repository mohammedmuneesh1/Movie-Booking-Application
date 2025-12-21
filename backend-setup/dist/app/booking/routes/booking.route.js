import express from 'express';
import isAuth from '../../../middlewares/isAuth.js';
import tryCatch from '../../../middlewares/tryCatch.js';
import { CREATE_BOOKING_CONTROLLER, GET_ALL_OCCUPIED_SEATS_BY_SHOWID } from '../controller/booking.controller.js';
const router = express.Router();
router.route('/create').post(isAuth, tryCatch(CREATE_BOOKING_CONTROLLER));
router.route('/seats/:showId').post(isAuth, tryCatch(GET_ALL_OCCUPIED_SEATS_BY_SHOWID));
export default router;
//# sourceMappingURL=booking.route.js.map