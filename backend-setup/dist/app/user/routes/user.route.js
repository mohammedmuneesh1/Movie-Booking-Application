import express from 'express';
import isAuth from '../../../middlewares/isAuth.js';
import tryCatch from '../../../middlewares/tryCatch.js';
import { USER_LOGIN_FN } from '../controller/user.controller.js';
const router = express.Router();
router.route('/login').post(tryCatch(USER_LOGIN_FN));
export default router;
//# sourceMappingURL=user.route.js.map