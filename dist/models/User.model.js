"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    // masterAdmin: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    role: {
        type: String,
        enum: ['masterAdmin', 'Admin', 'user', 'guest'],
        required: true,
        default: "guest"
    },
    resetPassword: {
        type: Boolean,
        default: true,
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Client',
        required: false
    }
}, {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
