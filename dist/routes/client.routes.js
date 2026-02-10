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
router.get("/", authMiddleware_1.default, async (req, res) => {
    try {
        const clients = await Client_model_1.default.find();
        res.status(200).json(clients);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/createClient", authMiddleware_1.default, async (req, res) => {
    try {
        const clientName = req.body.clientName?.trim();
        const adminUsername = req.body.adminUsername?.trim();
        const adminPassword = req.body.adminPassword;
        const clientLogo = req.body.clientLogo;
        if (!clientName || !adminUsername || !adminPassword) {
            return res.status(400).json({ message: "All Fields are Required." });
        }
        const hashedPassword = await bcrypt_1.default.hash(req.body.adminPassword, 12);
        const adminUser = await User_model_1.default.create({
            username: adminUsername,
            password: hashedPassword,
            role: "Admin",
            resetPassword: true,
        });
        const newClient = await Client_model_1.default.create({
            clientName: clientName,
            clientAdmin: adminUser._id,
            clientLogo: clientLogo,
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
            return res
                .status(409)
                .json({
                message: "Duplicate resource",
                field: Object.keys(error.keyValue)[0],
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/:clientId", authMiddleware_1.default, async (req, res) => {
    try {
        const clientId = req.params.clientId;
        // Non-masterAdmin users can only access their own client
        if (req.payload?.role !== "masterAdmin") {
            const tokenClientId = String(req.payload?.clientId || "");
            if (!tokenClientId || tokenClientId !== String(clientId)) {
                return res.status(403).json({
                    message: "Access denied. Insufficient permissions for this client.",
                });
            }
        }
        const client = await Client_model_1.default.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }
        console.log(client);
        res.status(200).json(client);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.patch("/:clientId", authMiddleware_1.default, async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const updateData = req.body;
        // Non-masterAdmin users can only update their own client
        if (req.payload?.role !== "masterAdmin") {
            const tokenClientId = String(req.payload?.clientId || "");
            if (!tokenClientId || tokenClientId !== String(clientId)) {
                return res.status(403).json({
                    message: "Access denied. Insufficient permissions for this client.",
                });
            }
        }
        const updatedClient = await Client_model_1.default.findByIdAndUpdate(clientId, updateData, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found." });
        }
        res.status(200).json(updatedClient);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.delete("/:clientId", authMiddleware_1.default, async (req, res) => {
    try {
        const clientId = req.params.clientId;
        if (req.payload?.role !== "masterAdmin") {
            return res.status(403).json({
                message: "Access denied. Insufficient permissions for this client.",
            });
        }
        const deletedClient = await Client_model_1.default.findByIdAndDelete(clientId);
        if (!deletedClient) {
            return res.status(404).json({ message: "Client not found." });
        }
        res.status(200).json({ message: "Client deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
