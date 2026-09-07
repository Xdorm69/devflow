import express from "express";
import authenticate from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validate.ts";
import asyncHandler from "../../utils/async.ts";
import UserController from "./users.controller.ts";
import { searchUsersQuerySchema, updateProfileSchema } from "./users.validator.ts";

const usersRouter = express.Router();
const userController = new UserController();

// NOTE: mounted after /me and /search so those literal segments never get
// swallowed by the "/:id" wildcard below.
usersRouter.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(userController.updateMe),
);

usersRouter.get(
  "/search",
  authenticate,
  validate(searchUsersQuerySchema, "query"),
  asyncHandler(userController.search),
);

usersRouter.get("/:id", authenticate, asyncHandler(userController.getById));

export default usersRouter;
