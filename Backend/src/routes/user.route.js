import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { login, signup } from "../controller/authController.js";


const router = Router();

router.route("/signup").post(asyncHandler(signup));
router.route("/login").post(asyncHandler(login));

export default router;