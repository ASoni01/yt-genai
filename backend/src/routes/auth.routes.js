import {Router} from "express";
import { registerUserController,loginUserController } from "../controllers/auth.controller.js";
const authRouter=Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
authRouter.post("/register",registerUserController);

authRouter.post("/login",loginUserController);

export default authRouter;

