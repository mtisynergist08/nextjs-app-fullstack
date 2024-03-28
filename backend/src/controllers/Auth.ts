import prisma from "../config/dbConfig/prismaConfig";
import argon2 from "argon2";
import { RequestHandler } from "express";
import { UserModel } from "../models/UserModels";
import jwt from "jsonwebtoken";
import env from "../config/utils/validatePath";

export const Login: RequestHandler<
  unknown,
  unknown,
  UserModel,
  unknown
> = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await argon2.verify(user.password, req.body.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // create access token for user
  const accessTokenSecret = env.JWT_SECRET;
  const accessToken = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessTokenSecret,
    {
      expiresIn: "30s",
    },
  );

  //create the refresh token for user
  const refreshTokenSecret = env.JWT_REFRESH_SECRET;
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    refreshTokenSecret,
    {
      expiresIn: "1d",
    },
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refreshToken },
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    // secure: true, // Enable this for HTTPS
    // sameSite: "strict",
    // path: "/",
    // expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // For Express session, if you want to store user data
  req.session.userId = user.id;
  req.session.name = user.name;
  req.session.email = user.email;

  console.log(req.session.cookie);
  console.log(req.session);
  console.log(req.cookies);

  res.json({ accessToken });
};

export const Profile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const userId = req.session.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user profile response
    res.status(200).json(user);
  } catch (error: any) {
    // Handle the error and send an appropriate error response
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const Logout: RequestHandler = async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refreshToken found in cookies");
    return res.sendStatus(204);
  }

  const user = await prisma.user.findMany({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!user[0]) {
    console.log("No user found for refreshToken:", refreshToken);
    return res.sendStatus(204);
  }

  const userId = user[0].id;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("refreshToken");
  res.clearCookie("connect.sid");

  req.session.destroy((error) => {
    console.log("session to be destroy", req.session);
    if (error) {
      return res.status(400).json({ message: "Cannot Logout" });
    }
    res.status(200).json({ message: "Successfully logged out" });
  });
};
