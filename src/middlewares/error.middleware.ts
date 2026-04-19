import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: string[] = [];
  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";

    const field = Object.keys(err.keyValue)[0];
    errors = [`${field} already exists`];
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
    errors = [`Invalid ${err.path}`];
  }

  if (err.message?.includes("token")) {
    statusCode = 401;
    message = "Unauthorized";
    errors = [err.message];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
  });
};