import express from "express";
import {
  createUserSchema,
  changePasswordSchema,
  getDownlineSchema,
} from "../validations/user.validation";
import { validateBody } from "../middlewares/yup.middleware";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/balance",
  authMiddleware,
  UserController.getBalance
);

router.get(
  "/downline",
  authMiddleware,
  UserController.getDownline
);

router.post(
  "/",
  authMiddleware,
  validateBody(createUserSchema),
  UserController.createUser
);

router.post(
  "/change-password",
  authMiddleware,
  validateBody(changePasswordSchema),
  UserController.changePassword
);


router.get(
  "/:id/children",
  authMiddleware,
  UserController.getChildren
);
export default router;