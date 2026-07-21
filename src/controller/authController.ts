import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import {generateTokens , verifyRefreshToken,generateAccessToken} from "../utils/jwt.js"
const prisma = new PrismaClient();


export const register = async (req: Request, res: Response) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    message: "User Registered Successfully",
    user,
    
  });
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find User
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Compare Password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  // Generate Tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Save Refresh Token in Database
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  // Response
  res.status(200).json({
    message: "Login Successful",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const refreshToken = async (req: Request,res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh Token is required",
    });
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Refresh Token",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      refreshToken,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid Refresh Token",
    });
  }

  const accessToken = generateAccessToken(user.id);

  return res.status(200).json({
    message: "New Access Token Generated Successfully",
    accessToken,
  });
};