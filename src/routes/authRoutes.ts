import { Router } from "express";
import {
  login,
  refreshToken,
  register,
} from "../controller/authController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
} from "../validations/authValidation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/profile",
  verifyToken
);

router.post(
  "/refresh",
  refreshToken
);

export default router;