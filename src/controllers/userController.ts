import express from "express";
import { db } from "../db/db";

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const users = await db("users")
      .limit(pageSize)
      .offset(pageNumber * pageSize);
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: (error as Error).message,
    });
  }
};

export const getUserCount = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const count = await db("users").count("* as total");
    res.status(200).json({
      success: true,
      message: "User count fetched successfully",
      data: count[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user count",
      error: (error as Error).message,
    });
  }
};

export const getUserById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = await db("users").where({ id: req.params.id }).first();
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    const address = await db("addresses").where({ userId: user.id }).first();
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: { ...user, address },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: (error as Error).message,
    });
  }
};

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
      return;
    }
    const [user] = await db("users").insert({ name, email }).returning("*");
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: (error as Error).message,
    });
  }
};
