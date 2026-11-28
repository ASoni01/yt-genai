import {Router} from "express";
import { registerUserController,loginUserController ,logoutUserController,getMeUserController} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const authRouter=Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
authRouter.post("/register",registerUserController);

authRouter.post("/login",loginUserController);

authRouter.get('/logout',logoutUserController);

authRouter.get('/get-me',authMiddleware,getMeUserController);

export default authRouter;

