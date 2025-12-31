import express from "express";
import { register, login, checkRole, verifyAdmin } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/verify", checkRole);
router.post("/verify-admin", verifyAdmin);

router.post("/register", register);
router.post("/login", login);

export default router;
