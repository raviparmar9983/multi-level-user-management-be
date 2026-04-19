import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { TransactionController } from "../controllers/transaction.controller";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  TransactionController.getMyTransactions
);

export default router;