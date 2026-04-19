import express from "express";
import { validateBody } from "../middlewares/yup.middleware";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validateBody(loginSchema),
  AuthController.login
);

router.post(
  "/refresh-token",
  validateBody(refreshTokenSchema),
  AuthController.refreshToken
);

router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  AuthController.resetPassword
);

router.get("/verify", AuthController.verifyEmail);

export default router;