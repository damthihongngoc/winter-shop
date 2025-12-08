import express from "express";
import { register, login, checkRole } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/verify", checkRole);

router.post("/register", register);
router.post("/login", login);

export default router;
