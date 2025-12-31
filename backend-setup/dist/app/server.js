import express, {} from 'express';
// import connectDB from './utils/db.js';
// import { router as UserRoutes } from './routes/user.route.js';
import cors from 'cors';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';
import showRouter from './show/route/show.route.js';
import UserRouter from './user/routes/user.route.js';
import BookingRouter from './booking/routes/booking.route.js';
import AdminRouter from './admin/routes/admin.route.js';
import FavourtieRouter from './favourite/route/favourite.route.js';
import { stripeWebHooks } from './stripe/services/stripe.webhooks.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error('PORT is not defined');
}
app.use(cors());
//stripe webhooks route 
// ✅ Stripe webhook MUST come before express.json
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks);
//express.raw “DO NOT open the envelope. Give me the body exactly as it arrived.”
//incomgin request body {"name":"John","age":30}
// what express.raw()  req.body = <Buffer 7b 22 6e 61 6d 65 22 ... > req.body = <Buffer 7b 22 6e 61 6d 65 22 ... > 
// That buffer is the exact bytes sent by the client.
// ✅ Now safe to parse JSON for everything else
app.use(express.json());
//“If the body looks like JSON, open the envelope, read it, and convert it into a JavaScript object.”
//Incoming request body (raw) {"name":"John","age":30}
// After express.json()
// req.body = {
//   name: "John",
//   age: 30
// };
//So yes — it converts JSON text into a JS object.
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl},`);
    next();
});
app.use('/api/users', UserRouter);
app.use('/api/show', showRouter);
app.use('/api/bookings', BookingRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/favourites', FavourtieRouter);
app.get("/", (req, res) => {
    console.log('Api Working');
    return res.status(200).json({
        success: true,
        message: "API is working",
    });
});
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});
if (process.env.NODE_ENV !== 'production') {
    connectDB()
        .then(() => {
        app.listen(PORT, () => {
            console.log(`User service listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });
    })
        .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
else {
    // For Vercel/production, connect to DB but don't call listen
    connectDB().catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });
}
;
//for vercel deploy
export default app;
//# sourceMappingURL=server.js.map