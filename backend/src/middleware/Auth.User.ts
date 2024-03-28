import { UserModel } from "../models/UserModels";
import { RequestHandler } from "express";
import prisma from "../config/dbConfig/prismaConfig";

export const verifyUser: RequestHandler = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const userId = req.session.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Send the user profile response
  req.userId = user.id;
  req.role = user.role ?? "USER";
  next();
};

export const adminOnly: RequestHandler = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.session.userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "Not authorized" });
  }
  next();
};
