import session from "express-session";
declare module "express-session" {
  export interface SessionData {
    userId: string;
    role: string | null;
    email?: string;
    name?: string;
    refreshToken: string;
  }
}
declare module "express-serve-static-core" {
  export interface Request {
    userId?: string; // Add any other custom properties you need
    role?: string;
  }
}

import { Request } from "express";

declare module "express" {
  interface Request {
    email?: string;
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    email: string;
    // You can add other properties if needed
  }
}