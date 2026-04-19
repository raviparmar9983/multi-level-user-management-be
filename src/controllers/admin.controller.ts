import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";

export class AdminController {
  static async getRootUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await AdminService.getRootUsers(req.query);

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async transfer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AdminService.transferToUser(req.body);

      res.json({
        success: true,
        message: "Transfer successful",
      });
    } catch (error) {
      next(error);
    }
  }
}