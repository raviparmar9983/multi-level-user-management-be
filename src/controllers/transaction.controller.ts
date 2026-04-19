import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";


export class TransactionController {
  static async getMyTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.userId;

      const data = await TransactionService.getUserTransactions(
        userId,
        req.query
      );

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  }
}