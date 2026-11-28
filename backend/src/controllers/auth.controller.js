import { userModel } from "../models/user.model.js";
import { tokenBlackiListModel } from "../models/blacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @route POST /api/auth/register
// @desc Register a new user with email and password
// @access Public
export async function registerUserController(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already exists with the provided username or email",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: { id: user._id, username: user.username, email: user.email },
  });
}

export async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlackiListModel.create({ token });
  }
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

export async function getMeUserController(req, res) {
  const user = await userModel.findById(req.user.id);
  res
    .status(200)
    .json({
      message: "User fetched successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
}
