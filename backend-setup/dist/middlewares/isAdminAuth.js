import jwt, {} from 'jsonwebtoken';
export default async function isAdminAuth(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }
        }
        const token = bearerToken.split(' ')[1];
        if (!token || typeof token !== "string") {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        if (decoded.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Only admin can access this route.'
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error(`Error occured on auth:${error instanceof Error ? error.message : error}`);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}
//# sourceMappingURL=isAdminAuth.js.map