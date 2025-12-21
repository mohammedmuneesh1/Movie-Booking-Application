import type { NextFunction, Request, Response } from "express";
import { type JwtPayload } from 'jsonwebtoken';
export interface AdminAuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export default function isAdminAuth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=isAdminAuth.d.ts.map