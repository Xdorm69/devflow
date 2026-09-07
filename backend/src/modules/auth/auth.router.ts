import express from "express";
import authenticate from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validate.ts";
import { loginLimiter, registerLimiter } from "../../middlewares/rateLimiter.ts";
import asyncHandler from "../../utils/async.ts";
import AuthController from "./auth.controller.ts";
import { loginSchema, registerSchema } from "./auth.validator.ts";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  asyncHandler(authController.register),
);

authRouter.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  asyncHandler(authController.login),
);

authRouter.post("/refresh", asyncHandler(authController.refresh));

authRouter.post("/logout", asyncHandler(authController.logout));

authRouter.get("/me", authenticate, asyncHandler(authController.me));

export default authRouter;
