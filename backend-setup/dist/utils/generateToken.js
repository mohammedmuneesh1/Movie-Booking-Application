import jwt, {} from 'jsonwebtoken';
const generateToken = (data, expiresIn) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const options = {
        //eslint-disable-next-line
        expiresIn: expiresIn
    };
    return jwt.sign(data, secret, options);
};
export default generateToken;
//# sourceMappingURL=generateToken.js.map