import type { NextFunction, Request, Response } from "express";
import { type JwtPayload } from 'jsonwebtoken';
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export default function isAuth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=isAuth.d.ts.map