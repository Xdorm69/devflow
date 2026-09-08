import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMiddleware.ts";
import authRouter from "./modules/auth/auth.router.ts";
import envConfig from "./configs/config.ts";
import workspaceRouter from "./modules/workspace/workspace.router.ts";
import usersRouter from "./modules/users/users.router.ts";
import projectsRouter from "./modules/projects/projects.router.ts";
import labelsRouter from "./modules/labels/labels.router.ts";

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

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "OK" });
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/workspace", workspaceRouter);
// Resources nested under a workspace: projects -> issues -> comments, and
// labels. Mounted separately (rather than inside workspaceRouter) since
// workspaceRouter's own routes use ":id" for the workspace id, while every
// resource nested under it uses ":workspaceId" (see requireWorkspaceRoles.ts).
app.use("/api/v1/workspace/:workspaceId/projects", projectsRouter);
app.use("/api/v1/workspace/:workspaceId/labels", labelsRouter);

app.use(errorMiddleware);

export default app;
