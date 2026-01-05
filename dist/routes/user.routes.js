"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../models/User.model"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
router.get("/", authMiddleware_1.default, async (req, res) => {
    try {
        const foundUsers = await User_model_1.default.find();
        if (foundUsers.length === 0) {
            res.status(404).json({ message: `No users found!` });
        }
        else {
            res.status(200).json(foundUsers);
        }
    }
    catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});
// router.get("/:userId" , async (req, res)=> {
//   const {userId} =req.params;
//   try {
//     const foundUser = await User.findById(userId)
//     console.log(foundUser)
//     res.status(200).json(foundUser)
//   } catch (error) {
//     res.status(500).json({message: `${error}`})
//   }
// })
// Signup route - only accessible to masterAdmin and Admin roles
router.post("/signup", authMiddleware_1.default, (0, roleMiddleware_1.requireRole)(["masterAdmin", "Admin"]), async (req, res) => {
    try {
        const salt = bcrypt_1.default.genSaltSync(12);
        const hashedPassword = bcrypt_1.default.hashSync(req.body.password, salt);
        const hashedUser = {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role || "user", // Default to 'user' if not specified, but admins can set it
            resetPassword: req.body.resetPassword !== undefined ? req.body.resetPassword : true,
        };
        const createdUser = await User_model_1.default.create(hashedUser);
        res
            .status(201)
            .json({ message: "User created Sucessfully!", user: createdUser });
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Username already exists" });
        }
        res.status(500).json({ message: `${error}` });
    }
});
//TODO: finish the login workflow and role-based  authentication
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User_model_1.default.findOne({ username: username });
        if (!foundUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, foundUser.password);
        if (isPasswordValid) {
            const data = {
                _id: foundUser._id,
                username: foundUser.username,
                role: foundUser.role, // Include role in JWT token for authorization
            };
            const authToken = jsonwebtoken_1.default.sign(data, process.env.TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: "10d",
            });
            res.status(200).json({
                message: "Here is the token",
                authToken,
                userId: foundUser._id,
                role: foundUser.role,
                resetPassword: foundUser.resetPassword,
            });
        }
        else {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `Invalid Credentials`, error: `${error}` });
    }
});
router.patch("/resetpassword/:userId", authMiddleware_1.default, async (req, res) => {
    const { newPassword } = req.body;
    const { userId } = req.params;
    try {
        const salt = bcrypt_1.default.genSaltSync(12);
        const newHashedPassword = bcrypt_1.default.hashSync(newPassword, salt);
        const updatedUser = {
            password: newHashedPassword,
            resetPassword: false,
        };
        const updatedUserPassword = await User_model_1.default.findByIdAndUpdate(userId, updatedUser);
        res.status(200).json({ message: "Password Upated Sucessfuly!" });
    }
    catch (error) {
        res.status(500).json({ message: "No user found" });
    }
});
exports.default = router;
