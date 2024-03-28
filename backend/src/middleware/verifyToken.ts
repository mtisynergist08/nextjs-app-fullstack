import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import env from "../config/utils/validatePath";
import { JwtPayload } from "jsonwebtoken";

export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    env.JWT_SECRET as string,
    (
      err: jwt.VerifyErrors | null,
      decoded: JwtPayload | string | undefined,
    ) => {
      if (err) return res.sendStatus(403);

      if (typeof decoded === "object" && decoded !== null) {
        // Here, you can access the email property
        req.email = decoded.email;
      }

      next();
    },
  );
};
