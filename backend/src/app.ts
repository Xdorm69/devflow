import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMiddleware.ts";
import authRouter from "./modules/auth/auth.router.ts";
import envConfig from "./configs/config.ts";

const app = express();

// Trust the first proxy hop (e.g. behind a load balancer / reverse proxy in
// production) so `secure` cookies and rate limiting see the real client info.
app.set("trust proxy", 1);

// Standard Express middleware works natively without extra configuration
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true, // required so the browser sends/receives the refresh cookie
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(envConfig.NODE_ENV === "production" ? "combined" : "dev"));

// API Routes
app.use("/api/v1/auth", authRouter)

app.use(errorMiddleware);

export default app;
