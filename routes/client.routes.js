const router = require("express").Router();
const Client = require("../models/Client.model");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//TODO: Implement the connection between the front and the backend. 
router.post("/createClient", async (req, res) => {
  try {
    const ClientName = req.body.ClientName?.trim();
    const AdminUsername = req.body.AdminUsername?.trim().toLowerCase();
    const AdminPassword = req.body.AdminPassword;

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

    res
      .status(201)
      .json({
        message: "Client and admin created sucessfully",
        clientId: newClient._id,
        adminId: adminUser._id,
      });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate resource' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
