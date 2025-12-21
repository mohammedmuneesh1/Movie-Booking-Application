import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
export declare function ADD_OR_REMOVE_FAVOURITE_MOVIE_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function GET_USER_ALL_FAVOURITE_MOVIES_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=favourite.controller.d.ts.map