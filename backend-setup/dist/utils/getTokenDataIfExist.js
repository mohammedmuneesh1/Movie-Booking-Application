import jwt, {} from 'jsonwebtoken';
export function getTokenDataIfExist(req) {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return null;
        }
        const token = bearerToken.split(' ')[1];
        if (!token || typeof token !== "string") {
            return null;
        }
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenData) {
            return null;
        }
        return tokenData;
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=getTokenDataIfExist.js.map