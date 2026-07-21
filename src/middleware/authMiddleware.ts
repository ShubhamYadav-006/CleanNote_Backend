import type { Response, NextFunction } from "express";
import type  { AuthRequest } from "../types/express.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!JWT_SECRET) {
        return res.status(500).json({
            message: "JWT secret not configured",
        });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token Not Provided",
        });
    }


    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Invalid authorization Header",
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        req.user = {
            id: decoded.id,
        };
        
        console.log(decoded);
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }

};