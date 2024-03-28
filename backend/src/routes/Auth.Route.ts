import express from "express";
import { Login, Profile, Logout } from "../controllers/Auth";
import { verifyToken } from "../middleware/verifyToken";
import { refreshTokenAccess } from "../controllers/RefreshCookie";

const router = express.Router();

router.get("/profile", verifyToken, Profile);

router.post("/login", Login);

router.get("/refresh-token", refreshTokenAccess);

router.delete("/logout", Logout);

export default router;
