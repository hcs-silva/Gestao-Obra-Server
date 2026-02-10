import express, { Application } from "express";
import dotenv from "dotenv";

import "./db";
import config from "./config";
import indexRoutes from "./routes/index.routes";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import obrasRoutes from "./routes/obras.routes";
import errorHandling from "./error-handling";

dotenv.config();

const app: Application = express();

config(app);

// Routes
app.use("/api", indexRoutes);
app.use("/users", userRoutes);
app.use("/clients", clientRoutes);
app.use("/obras", obrasRoutes);

// Error handling
errorHandling(app);

export default app;
