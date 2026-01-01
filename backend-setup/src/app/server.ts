
import express, { type Request, type Response } from 'express'
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
import {serve} from 'inngest/express'
import { inngest, releaseSeatsAndDeleteBookings, sendBookingConfirmationEmail } from '../config/ingest/ingestFunction.js';
import { ensureDBConnection } from '../config/ensureDBConnection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
if(!PORT) {
    throw new Error('PORT is not defined');
}


app.use(cors());
   if(process.env.NODE_ENV === 'production'){
     app.use(ensureDBConnection);
   }
//big question: if i place origin on cors, does it interrupt stripe webhooks? the origin set https://hello.com , does it effect webhooks? 
//answer: no, it doesn't interrupt stripe webhooks.
//CORS headers are only checked by browsers.
//  Since Stripe's webhook is a server-to-server HTTP request (not from a browser), CORS restrictions don't affect it.





//stripe webhooks route 
// ✅ Stripe webhook MUST come before express.json
app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebHooks);
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

    const time = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
  console.log(`[${time}] [${req.method}] ${req.originalUrl}`);

  next();
});


// ✅ ADD INNGEST ENDPOINT HERE (BEFORE YOUR OTHER ROUTES)
app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [releaseSeatsAndDeleteBookings,sendBookingConfirmationEmail],
    // signingKey: process.env.INNGEST_SIGNING_KEY as string,
  })
);









app.use('/api/users',UserRouter);
app.use('/api/show',showRouter);
app.use('/api/bookings',BookingRouter);
app.use('/api/admin',AdminRouter);
app.use('/api/favourites',FavourtieRouter);

app.get("/",(req:Request, res:Response) => {
  console.log('Api Working')
  return res.status(200).json({
    success: true,
    message: "API is working",
  });
});




app.use((req:Request, res:Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

interface CustomError extends Error {
  statusCode?: number;
}


app.use((err:CustomError, req:Request, res:Response,) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});




   if(process.env.NODE_ENV !== 'production'){
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
};


//for vercel deploy
export default app;