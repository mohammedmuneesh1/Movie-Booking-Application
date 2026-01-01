import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
/**
 * @desc    POST HELPS USER TO REGISTER A SEAT (BOOKING)
 * @route   GET /api/bookings/create ⚠️
 * @access  Private  ⚠️
 * @returns  booking object of db  ⚠️
 */
export declare function CREATE_BOOKING_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    get occupied seats
 * @route   GET /api/bookings/occupied-seata ⚠️
 * @access  Private  ⚠️
 * @returns  object of occupied seats  ⚠️
 */
export declare function GET_ALL_OCCUPIED_SEATS_BY_SHOWID(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function GET_ALL_BOOKINGS_CONTROLLER_B1(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function GET_ALL_USER_BOOKINGS_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=booking.controller.d.ts.map