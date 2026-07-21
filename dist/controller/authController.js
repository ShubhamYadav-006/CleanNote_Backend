"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jwt_js_1 = require("../utils/jwt.js");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
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
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
exports.register = register;
const login = async (req, res) => {
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
    const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid Password",
        });
    }
    // Generate Tokens
    const { accessToken, refreshToken } = (0, jwt_js_1.generateTokens)(user.id);
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
exports.login = login;
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh Token is required",
        });
    }
    let decoded;
    try {
        decoded = (0, jwt_js_1.verifyRefreshToken)(refreshToken);
    }
    catch (error) {
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
    const accessToken = (0, jwt_js_1.generateAccessToken)(user.id);
    return res.status(200).json({
        message: "New Access Token Generated Successfully",
        accessToken,
    });
};
exports.refreshToken = refreshToken;
