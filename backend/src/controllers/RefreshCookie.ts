import prisma from "../config/dbConfig/prismaConfig";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";
import env from "../config/utils/validatePath";

export const refreshTokenAccess: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      console.log("No refreshToken found in cookies");
      return res.sendStatus(401);
    }

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = await prisma.user.findMany({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user || user.length === 0) {
      console.log("No user found for refreshToken:", refreshToken);
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET as string,
      (
        err: jwt.VerifyErrors | null,
        decoded: JwtPayload | string | undefined,
      ) => {
        if (err) {
          console.log("Refresh token verification error:", err);
          return res.sendStatus(403);
        }

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessTokenClient = jwt.sign(
          { userId, name, email },
          env.JWT_SECRET,
          {
            expiresIn: "30s",
          },
        );

        if (typeof decoded === "object" && decoded !== null) {
          // Here, you can access the email property
          req.email = decoded.email;
          console.log("Refresh token decoded : ", decoded);
        }

        res.json({ accessTokenClient, refreshToken });
      },
    );
  } catch (e) {
    console.log("Error in refreshTokenAccess middleware:", e);
    return res.sendStatus(403);
  }
};
