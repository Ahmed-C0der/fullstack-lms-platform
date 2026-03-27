import express from "express";
import { register,login,me,requireAuth, logout } from "../controllers/auth.controller.js";
const router = express.Router()

router.post("/register",register)
router.post("/login",login);
router.post("/logout",logout);
router.get("/me", requireAuth, me)



export default router