import express from "express";
import { db } from "../db/db";

export const createPost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, title, body } = req.body;
    if (!userId || !title || !body) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    const post = await db("posts")
      .insert({
        userId,
        title,
        body,
      })
      .returning("*");
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: (error as Error).message,
    });
  }
};

export const getPosts = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "userId query parameter is required",
      });
      return;
    }
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      res.status(404).json({
        success: true,
        message: "User not found!",
      });
      return;
    }
    const posts = await db("posts").where({ userId });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: (error as Error).message,
    });
  }
};

export const deletePost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedPost = await db("posts").where({ id }).del();
    if (!deletedPost) {
      res.status(404).json({
        success: false,
        message: "Post not found!",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: (error as Error).message,
    });
  }
};
