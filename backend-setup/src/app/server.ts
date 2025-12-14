
import express, { type Request, type Response } from 'express'
// import connectDB from './utils/db.js';
// import { router as UserRoutes } from './routes/user.route.js';
import type { JwtPayload } from 'jsonwebtoken';
import cors from 'cors';
import connectDB from '../config/db.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT;
if(!PORT) {
    throw new Error('PORT is not defined');
}



app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());



app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl},`);
  
  next();
});
// app.use('/api/users',UserRoutes);


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