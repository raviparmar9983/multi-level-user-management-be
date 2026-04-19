import { Request, Response, NextFunction } from "express";
import { decryptJWT } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    iat?: number;
    exp?: number;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = await decryptJWT(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};