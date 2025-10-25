const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

router.get("/", async (req, res) => {
  try {
    const foundUsers = await User.find();
    if (foundUsers.length === 0) {
      res.status(404).json({ message: `No users found!` });
    } else {
      res.status(200).json(foundUsers);
    }
  } catch (error) {
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

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const hashedUser = {
      username: req.body.username,
      password: hashedPassword,
      masterAdmin: req.body.masterAdmin,
      isAdmin: req.body.isAdmin,
      resetPassword: req.body.resetPassword,
    };

    const createdUser = await User.create(hashedUser);

    res.status(201).json({ message: "User created Sucessfully!" }, createdUser);
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});
//TODO: finish the login workflow and role-based  authentication
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const isPasswordValid = bcrypt.compare(password, foundUser.password);

    if (isPasswordValid) {
      const data = {
        _id: foundUser._id,
        username: foundUser.username,
      };

      const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "10d",
      });

      res.status(200).json({
        message: "Here is the token",
        authToken,
        userId: foundUser._id,
        masterAdmin: foundUser.masterAdmin,
        isAdmin: foundUser.isAdmin,
        resetPassword: foundUser.resetPassword,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Invalid Credentials`, error: `${error}` });
  }
});

router.patch("/resetpassword/:userId", async (req, res) => {
  const { newPassword } = req.body;
  
  const { userId } = req.params;

  try {
    
    const salt = bcrypt.genSaltSync(12)

    const newHashedPassword = bcrypt.hashSync(newPassword, salt)

    const updatedUser = {      
      password: newHashedPassword,
      resetPassword: false
    }

    const updatedUserPassword = await User.findByIdAndUpdate(userId, updatedUser)

    res.status(200).json({message: "Password Upated Sucessfuly!"})
  } catch (error) {
    res.status(500).json({message: "No user found"})
  }
});

module.exports = router;
