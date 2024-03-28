import { RequestHandler } from "express";
import prisma from "../config/dbConfig/prismaConfig";
import generateRandomTID from "../config/utils/receiptTask";

export const getProducts: RequestHandler = async (req, res) => {
  try {
    let response;
    if (req.role === "ADMIN") {
      response = await prisma.products.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          user: {
            select: {
              email: true,
              name: true,
              departments: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } else {
      response = await prisma.products.findMany({
        where: {
          userId: req.userId,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });
    }
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    let response;

    if (req.role === "ADMIN") {
      response = await prisma.products.findUnique({
        where: {
          id: product.id,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          user: {
            select: {
              email: true,
              name: true,
              departments: {
                select: {
                  id: true,
                  name: true,
                },
              }
            },
          },
        },
      });
    } else {
      response = await prisma.products.findUnique({
        where: {
          userId: req.userId,
          id: product.id,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });
    }
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  const { name, price } = req.body;
  try {
    await prisma.products.create({
      data: {
        name: name,
        price: price,
        sku: generateRandomTID(),
        userId: req.userId as string,
      },
    });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.role === "ADMIN") {
      await prisma.products.update({
        where: {
          id: product.id,
        },
        data: {
          name: name,
          price: price,
        },
      });
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      await prisma.products.update({
        where: {
          userId: req.userId,
          id: product.id,
        },
        data: {
          name: name,
          price: price,
        },
      });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.role === "ADMIN") {
      await prisma.products.delete({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      await prisma.products.delete({
        where: {
          userId: req.userId,
          id: product.id,
        },
      });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
