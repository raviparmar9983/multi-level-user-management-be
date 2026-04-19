import { Request, Response, NextFunction } from "express";
import { WalletService } from "../services/wallet.service";

export class WalletController {
  static async recharge(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const balance = await WalletService.recharge(userId, req.body);

      res.json({ success: true, balance });
    } catch (error) {
      next(error);
    }
  }

  static async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      await WalletService.transfer(userId, req.body);

      res.json({ success: true, message: "Transfer successful" });
    } catch (error) {
      next(error);
    }
  }
}