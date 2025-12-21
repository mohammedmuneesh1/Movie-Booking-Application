
import express from 'express';
import tryCatch from '../../../middlewares/tryCatch.js';
import isAuth from '../../../middlewares/isAuth.js';
import { ADD_OR_REMOVE_FAVOURITE_MOVIE_CONTROLLER, GET_USER_ALL_FAVOURITE_MOVIES_CONTROLLER } from '../controller/favourite.controller.js';


const router = express.Router();

router.route('/add-remove').post(isAuth,tryCatch(ADD_OR_REMOVE_FAVOURITE_MOVIE_CONTROLLER));
router.route('/').get(isAuth,tryCatch(GET_USER_ALL_FAVOURITE_MOVIES_CONTROLLER));

export default router;
//router.route('/').get(isAuth,tryCatch())

