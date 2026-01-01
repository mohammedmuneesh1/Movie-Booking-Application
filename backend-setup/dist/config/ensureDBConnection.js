import connectDB from '../config/db.js';
export const ensureDBConnection = async (req, res, next) => {
    try {
        await connectDB();
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
};
//# sourceMappingURL=ensureDBConnection.js.map