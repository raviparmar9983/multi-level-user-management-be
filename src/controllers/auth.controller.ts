import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.login(req.body);
      res.json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.refreshToken(req.body.token);
      res.json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.forgotPassword(req.body.email);
      res.json({ success: true, message: "Email sent" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(
        req.body.token,
        req.body.password
      );
      res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  }
  
  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      throw new Error("Token is required");
    }

    await AuthService.verifyEmail(token);

    return res.redirect(
      `${process.env.FRONTEND_URL}/email-verified`
    );
  } catch (error) {
    next(error);
  }
}
}