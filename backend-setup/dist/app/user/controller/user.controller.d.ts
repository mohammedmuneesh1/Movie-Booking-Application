import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
export declare const USER_LOGIN_FN: (req: Request, rs: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * @desc    Get MY PROFILE BY ID
 * @route   GET /api/users/profile/:id
 * @access  Private
 * @returns  MY profile object
 */
export declare function MY_PROFILE(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    Get USER PROFILE BY ID params
 * @route   GET /api/u-profile/:id
 * @access  Private
 * @returns  user profile object
 */
export declare function GET_USER_PROFILE_BY_ID(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    put USER PROFILE BY ID params
 * @route   PUT /api/profile/:id
 * @access  Private
 * @returns  user profile object
 */
export declare function UPDATE_USER_PROFILE_BY_ID(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    put udpate user profile picture
 * @route   PUT /api/profile/pic
 * @access  Private
 * @returns  user profile object
 */
export declare function UPDATE_USER_PROFILE_PIC(req: AuthenticatedRequest, res: Response): Promise<Response>;
/**
 * @desc    API CONTROLLER FUNCTION TO GET ALL USER BOOKINGS
 * @route   PUT /api/users/bookings
 * @access  Private
 * @returns  ALL BOOKINGS
 */
export declare function GET_USER_ALL_BOOKINGS_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response>;
/**
 * @desc    API CONTROLLER TO ADD FAVOURITE MOVIE
 * @route   PUT /api/users/bookings
 * @access  Private
 * @returns  ALL BOOKINGS
 */
//# sourceMappingURL=user.controller.d.ts.map