import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static async getDownline(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const data = await UserService.getDownlineUsers(
        userId,
        req.query
      );

      res.json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = (req as any).user.userId;

      const user = await UserService.createChildUser(
        parentId,
        req.body
      );

      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parentId = (req as any).user.userId;

      await UserService.changeChildPassword(
        parentId,
        req.body.userId,
        req.body.newPassword
      );

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.userId;

      const balance = await UserService.getUserBalance(userId);

      res.json({
        success: true,
        balance,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getChildren(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const result = await UserService.getDirectChildren(
        id as string,
        req.query
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}