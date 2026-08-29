import express, { Request, Response } from "express";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMiddleware.ts";
import authRouter from "./modules/auth/auth.router.ts";

const app = express();

// Standard Express middleware works natively without extra configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/auth", authRouter)

app.use(errorMiddleware);

export default app;
