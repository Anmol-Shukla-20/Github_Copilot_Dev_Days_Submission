import { Router } from "express";
import { googleAuth, updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/google", googleAuth);
router.put("/profile", authMiddleware, updateProfile);

export default router;
