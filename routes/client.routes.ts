import { Router, Request, Response } from "express";
import Client from "../models/Client.model";
import User from "../models/User.model";
import bcrypt from "bcrypt";
import isAuthenticated from "../middlewares/authMiddleware";

const router = Router();
//TODO: Implement the connection between the front and the backend.
router.post(
  "/createClient",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const ClientName = (req.body.ClientName as string)?.trim();
      const AdminUsername = (req.body.AdminUsername as string)
        ?.trim()
        .toLowerCase();
      const AdminPassword = req.body.AdminPassword as string;

      if (!ClientName || !AdminUsername || !AdminPassword) {
        return res.status(400).json({ message: "All Fields are Required." });
      }
      const hashedPassword = await bcrypt.hash(req.body.AdminPassword, 12);

      const adminUser = await User.create({
        username: AdminUsername,
        password: hashedPassword,
        role: "Admin",
        resetPassword: true,
      });

      const newClient = await Client.create({
        ClientName: ClientName,
        ClientAdmin: adminUser._id,
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
        return res.status(409).json({ message: "Duplicate resource" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
