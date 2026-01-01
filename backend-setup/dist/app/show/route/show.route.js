import express from 'express';
import isAuth from '../../../middlewares/isAuth.js';
import { ADD_NEW_MOVIE_SHOW_CONTROLLER, GET_ALL_SHOWS_CONTROLLER, GET_NOW_PLAYING_MOVIES_CONTROLLER, GET_SHOWS_BASED_ON_MOVIE_ID_CONTROLLER, GET_UNIQUE_SHOWS_CONTROLLER } from '../controller/show.controller.js';
import tryCatch from '../../../middlewares/tryCatch.js';
const router = express.Router();
router.route('/now-playing').get(tryCatch(GET_NOW_PLAYING_MOVIES_CONTROLLER));
router.route('/add-show').post(isAuth, tryCatch(ADD_NEW_MOVIE_SHOW_CONTROLLER));
router.route('/all').get(tryCatch(GET_ALL_SHOWS_CONTROLLER));
router.route('/unique-shows').get(tryCatch(GET_UNIQUE_SHOWS_CONTROLLER));
router.route('/:movieId').get(tryCatch(GET_SHOWS_BASED_ON_MOVIE_ID_CONTROLLER));
export default router;
//# sourceMappingURL=show.route.js.map