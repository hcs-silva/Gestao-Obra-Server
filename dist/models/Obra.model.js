"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const obraSchema = new mongoose_1.Schema({
    obraName: {
        type: String,
        required: true,
        trim: true,
    },
    obraDescription: {
        type: String,
        trim: true,
    },
    obraLocation: {
        type: String,
        trim: true,
    },
    obraStatus: {
        type: String,
        enum: ["planning", "in-progress", "completed", "on-hold"],
        default: "planning",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    budget: {
        type: Number,
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    responsibleUsers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
});
const Obra = (0, mongoose_1.model)("Obra", obraSchema);
exports.default = Obra;
