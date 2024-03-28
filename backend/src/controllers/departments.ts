import { RequestHandler } from "express";
import prisma from "../config/dbConfig/prismaConfig";

export const getDepartments: RequestHandler = async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(departments);
  } catch (error: unknown) {
    next(error);
  }
};

export const createDepartments: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const departments = await prisma.department.create({
      data: {
        name: name,
        userId: req.userId as string,
      },
    });

    if (!req.body) {
      res.status(400).json({ message: "All fields are required" });
    }
    res.status(201).json(departments);
  } catch (error: unknown) {
    next(error);
  }
};
