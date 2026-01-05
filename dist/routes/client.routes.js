"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Client_model_1 = __importDefault(require("../models/Client.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
//TODO: Implement the connection between the front and the backend.
router.post("/createClient", authMiddleware_1.default, async (req, res) => {
    try {
        const ClientName = req.body.ClientName?.trim();
        const AdminUsername = req.body.AdminUsername
            ?.trim()
            .toLowerCase();
        const AdminPassword = req.body.AdminPassword;
        if (!ClientName || !AdminUsername || !AdminPassword) {
            return res.status(400).json({ message: "All Fields are Required." });
        }
        const hashedPassword = await bcrypt_1.default.hash(req.body.AdminPassword, 12);
        const adminUser = await User_model_1.default.create({
            username: AdminUsername,
            password: hashedPassword,
            role: "Admin",
            resetPassword: true,
        });
        const newClient = await Client_model_1.default.create({
            ClientName: ClientName,
            ClientAdmin: adminUser._id,
        });
        await User_model_1.default.updateOne({ _id: adminUser._id }, { $set: { clientId: newClient._id } });
        res.status(201).json({
            message: "Client and admin created sucessfully",
            clientId: newClient._id,
            adminId: adminUser._id,
        });
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Duplicate resource" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
