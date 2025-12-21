import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
export declare function IS_ADMIN(req: AuthenticatedRequest, res: Response): Promise<Response>;
export declare function GET_DASHBOARD__DATA_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response>;
export declare function ADMIN_GET_ALL_SHOWS_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function GET_ALL_BOOKINGS_CONTROLLER(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=admin.controller.d.ts.map