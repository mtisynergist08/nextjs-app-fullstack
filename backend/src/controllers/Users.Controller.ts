import argon2 from "argon2";
import prisma from "../config/dbConfig/prismaConfig";
import { RequestHandler } from "express";
import { UserModel } from "../models/UserModels";
import generateRandomID from "../config/utils/employeeId";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const userResponse = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json(userResponse);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
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
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser: RequestHandler<
  unknown,
  unknown,
  UserModel,
  unknown
> = async (req, res, next) => {
  const { name, email, password, confPassword, role } = req.body;
  if (!name || !email || !password || !confPassword || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confPassword) {
    return res.status(400).json({ message: "Password does not match" });
  }

  const hashPassword = await argon2.hash(password);
  const employeeId = generateRandomID();

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        EmployeeId: employeeId,
        password: hashPassword,
        role,
      },
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateUser: RequestHandler<
  unknown,
  unknown,
  UserModel,
  unknown
> = async (req, res, next) => {
  const { id } = req.params as { id: string };
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword: string;
  if (password === "" || password === null || password === undefined) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) {
    res.status(400).json({ message: "Password does not match" });
  }
  const { id: userId } = user;
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password: hashPassword,
        role,
      },
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  try {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
