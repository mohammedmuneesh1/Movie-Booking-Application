import express from 'express';
import { ADMIN_GET_ALL_SHOWS_CONTROLLER, GET_ALL_BOOKINGS_CONTROLLER, GET_DASHBOARD__DATA_CONTROLLER, IS_ADMIN, SEND_EMAIL_TESTING_CONTROLLER } from '../controllers/admin.controller.js';
import tryCatch from '../../../middlewares/tryCatch.js';
import isAuth from '../../../middlewares/isAuth.js';
const router = express.Router();
router.route('/is-admin').get(isAuth, tryCatch(IS_ADMIN));
router.route('/dashboard').get(isAuth, tryCatch(GET_DASHBOARD__DATA_CONTROLLER));
router.route('/all-shows').get(isAuth, tryCatch(ADMIN_GET_ALL_SHOWS_CONTROLLER));
router.route('/all-bookings').get(isAuth, tryCatch(GET_ALL_BOOKINGS_CONTROLLER));
router.route('/send-email').post(isAuth, tryCatch(SEND_EMAIL_TESTING_CONTROLLER));
export default router;
//# sourceMappingURL=admin.route.js.map