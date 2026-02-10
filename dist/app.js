"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./db");
const config_1 = __importDefault(require("./config"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const obras_routes_1 = __importDefault(require("./routes/obras.routes"));
const error_handling_1 = __importDefault(require("./error-handling"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, config_1.default)(app);
// Routes
app.use("/api", index_routes_1.default);
app.use("/users", user_routes_1.default);
app.use("/clients", client_routes_1.default);
app.use("/obras", obras_routes_1.default);
// Error handling
(0, error_handling_1.default)(app);
exports.default = app;
