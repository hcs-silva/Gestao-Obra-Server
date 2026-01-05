"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
    ClientName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    ClientAdmin: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    Members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
});
const Client = (0, mongoose_1.model)("Client", clientSchema);
exports.default = Client;
