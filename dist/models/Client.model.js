"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    clientEmail: { type: String, trim: true, lowercase: true, unique: true },
    clientPhone: { type: String, trim: true, unique: true },
    clientLogo: { type: String },
    clientAdmin: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    subStatus: { type: Boolean, default: false },
    Members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
});
const Client = (0, mongoose_1.model)("Client", clientSchema);
exports.default = Client;
