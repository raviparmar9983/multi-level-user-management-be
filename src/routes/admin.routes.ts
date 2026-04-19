import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
    adminTransferSchema,
} from "../validations/admin.validation";
import { AdminController } from "../controllers/admin.controller";
import { validateBody } from "../middlewares/yup.middleware";

const router = express.Router();

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    AdminController.getRootUsers
);

router.post(
    "/transfer",
    authMiddleware,
    adminMiddleware,
    validateBody(adminTransferSchema),
    AdminController.transfer
);

export default router;