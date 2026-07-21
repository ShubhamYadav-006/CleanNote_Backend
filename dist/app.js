"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteRoutes_js_1 = __importDefault(require("./routes/noteRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const app = (0, express_1.default)();
// Custom CORS middleware to allow requests from the frontend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome To Notes Application Programming interface");
});
app.use("/auth", authRoutes_js_1.default);
app.use("/notes", noteRoutes_js_1.default);
exports.default = app;
