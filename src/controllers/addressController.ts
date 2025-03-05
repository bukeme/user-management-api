import express from "express";
import { db } from "../db/db";

export const createAddress = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, street, city, state, zip } = req.body;

    if (!userId || !street || !city || !state || !zip) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }
    const address = await db("addresses")
      .insert({
        userId,
        street,
        city,
        state,
        zip,
      })
      .returning("*");
    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: (error as Error).message,
    });
  }
};

export const getAddress = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const address = await db("addresses")
      .where({ userId: req.params.userId })
      .first();
    if (!address) {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address || {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
      error: (error as Error).message,
    });
  }
};

export const updateAddress = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { street, city, state, zip } = req.body;

    if (!street && !city && !state && !zip) {
      res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
      return;
    }
    const address = await db("addresses")
      .where({ userId: req.params.userId })
      .update({
        street,
        city,
        state,
        zip,
      })
      .returning("*");
    if (!address.length) {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: (error as Error).message,
    });
  }
};
