// middleware/ensureDBConnection.ts
import type { NextFunction, Request, Response } from 'express';
import connectDB from '../config/db.js';


export const ensureDBConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
};