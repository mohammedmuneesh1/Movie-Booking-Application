import type { NextFunction, Request, Response } from 'express';
export declare const ensureDBConnection: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ensureDBConnection.d.ts.map