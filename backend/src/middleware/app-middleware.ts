import cors from "cors";
import express from "express";
import ProductRoutes from "../routes/Product.Route";
import UserRoutes from "../routes/User.Route";
import { sessionMiddleware } from "../config/sessionStore/expressSession";
import DepartmentRoute from "../routes/departments.Route";
import AuthRoutes from "../routes/Auth.Route";
import { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // kalau banyak boleh guna ["array"]
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(sessionMiddleware);
app.use(AuthRoutes);
app.use(UserRoutes);
app.use(ProductRoutes);
app.use(DepartmentRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Handle errors (500 Internal Server Error)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging purposes
  res.status(500).json({ message: "Internal server error" });
});

export default app;
