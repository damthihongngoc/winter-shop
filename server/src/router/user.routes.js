import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/:id/change-password", changePassword);
router.delete("/:id", deleteUser);

export default router;