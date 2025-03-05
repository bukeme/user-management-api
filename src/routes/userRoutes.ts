import express from "express";
import {
  getUsers,
  getUserCount,
  getUserById,
  createUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.get("/count", getUserCount);
router.get("/:id", getUserById);
router.post("/", createUser);

module.exports = router;
