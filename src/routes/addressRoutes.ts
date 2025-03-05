import {
  createAddress,
  getAddress,
  updateAddress,
} from "../controllers/addressController";
import express from "express";

const router = express.Router();

router.post("/", createAddress);
router.get("/:userId", getAddress);
router.patch("/:userId", updateAddress);

module.exports = router;
