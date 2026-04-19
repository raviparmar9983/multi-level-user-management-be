import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  rechargeSchema,
  transferSchema,
} from "../validations/wallet.validation";
import { validateBody } from "../middlewares/yup.middleware";
import { WalletController } from "../controllers/wallet.controller";

const router = express.Router();

router.post(
  "/recharge",
  authMiddleware,
  validateBody(rechargeSchema),
  WalletController.recharge
);

router.post(
  "/transfer",
  authMiddleware,
  validateBody(transferSchema),
  WalletController.transfer
);

export default router;