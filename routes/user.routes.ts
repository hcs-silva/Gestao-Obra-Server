import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.model";
import isAuthenticated from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const foundUsers = await User.find();
    if (foundUsers.length === 0) {
      res.status(404).json({ message: `No users found!` });
    } else {
      res.status(200).json(foundUsers);
    }
  } catch (error: any) {
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
router.post(
  "/signup",
  isAuthenticated,
  requireRole(["masterAdmin", "Admin"]),
  async (req, res) => {
    try {
      const salt = bcrypt.genSaltSync(12);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const hashedUser = {
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role || "user", // Default to 'user' if not specified, but admins can set it
        resetPassword:
          req.body.resetPassword !== undefined ? req.body.resetPassword : true,
      };

      const createdUser = await User.create(hashedUser);

      res
        .status(201)
        .json({ message: "User created Sucessfully!", user: createdUser });
    } catch (error: any) {
      if (error?.code === 11000) {
        return res.status(409).json({ message: "Username already exists" });
      }
      res.status(500).json({ message: `${error}` });
    }
  }
);
//TODO: finish the login workflow and role-based  authentication
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (isPasswordValid) {
      const data = {
        _id: foundUser._id,
        username: foundUser.username,
        role: foundUser.role, // Include role in JWT token for authorization
      };

      const authToken = jwt.sign(data, process.env.TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "10d",
      });

      res.status(200).json({
        message: "Here is the token",
        authToken,
        userId: foundUser._id,
        role: foundUser.role,
        resetPassword: foundUser.resetPassword,
        clientId: foundUser.clientId,
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: `Invalid Credentials`, error: `${error}` });
  }
});

router.patch("/resetpassword/:userId", isAuthenticated, async (req, res) => {
  const { newPassword } = req.body;

  const { userId } = req.params;

  try {
    const salt = bcrypt.genSaltSync(12);

    const newHashedPassword = bcrypt.hashSync(newPassword, salt);

    const updatedUser = {
      password: newHashedPassword,
      resetPassword: false,
    };

    const updatedUserPassword = await User.findByIdAndUpdate(
      userId,
      updatedUser
    );

    res.status(200).json({ message: "Password Upated Sucessfuly!" });
  } catch (error: any) {
    res.status(500).json({ message: "No user found" });
  }
});

//TESTING PURPOSES ONLY - DELETE LATER
router.post("/test-signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const hashedUser = {
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role || "user", // Default to 'user' if not specified, but admins can set it
      resetPassword:
        req.body.resetPassword !== undefined ? req.body.resetPassword : true,
    };

    const createdUser = await User.create(hashedUser);

    res
      .status(201)
      .json({ message: "User created Sucessfully!", user: createdUser });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: `${error}` });
  }
});

export default router;
