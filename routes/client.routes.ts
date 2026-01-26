import { Router, Request, Response } from "express";
import Client from "../models/Client.model";
import User from "../models/User.model";
import bcrypt from "bcrypt";
import isAuthenticated from "../middlewares/authMiddleware";

const router = Router();

router.get("/", isAuthenticated, async (req: any, res: Response) => {
  
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/createClient",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const clientName = (req.body.clientName as string)?.trim();
      const adminUsername = (req.body.adminUsername as string)?.trim();
      const adminPassword = req.body.adminPassword as string;
      const clientLogo = req.body.clientLogo as string;

      if (!clientName || !adminUsername || !adminPassword) {
        return res.status(400).json({ message: "All Fields are Required." });
      }
      const hashedPassword = await bcrypt.hash(req.body.adminPassword, 12);

      const adminUser = await User.create({
        username: adminUsername,
        password: hashedPassword,
        role: "Admin",
        resetPassword: true,
      });

      const newClient = await Client.create({
        clientName: clientName,
        clientAdmin: adminUser._id,
        clientLogo: clientLogo,
      });

      await User.updateOne(
        { _id: adminUser._id },
        { $set: { clientId: newClient._id } }
      );

      res.status(201).json({
        message: "Client and admin created sucessfully",
        clientId: newClient._id,
        adminId: adminUser._id,
      });
    } catch (error: any) {
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
  }
);

router.get("/:clientId", isAuthenticated, async (req: any, res: Response) => {
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

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }
    console.log(client);
    res.status(200).json(client);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
