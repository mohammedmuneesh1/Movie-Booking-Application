import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
import type { Request, Response } from "express";
/**
 * @desc    Get tmdb india based now playing movies
 * @route   GET /api/shows/now-playing
 * @access  Private
 * @returns  movie array
 */
export declare function GET_NOW_PLAYING_MOVIES_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    an api to add new movie with shows to it
 * @route   GET /api/shows/add-show
 * @access  Private
 * @returns  null
 */
export declare function ADD_NEW_MOVIE_SHOW_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    an api to get all shows from the database
 * @route   GET /api/shows/add-show ⚠️
 * @access  Private⚠️
 * @returns  shows of unique  ⚠️
 */
export declare function GET_ALL_SHOWS_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function GET_UNIQUE_SHOWS_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * @desc    get a single show from the database
 * @route   GET /api/shows/add-show ⚠️
 * @access  Private  ⚠️
 * @returns  null  ⚠️
 */
export declare function GET_SHOWS_BASED_ON_MOVIE_ID_CONTROLLER(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=show.controller.d.ts.map