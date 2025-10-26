const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    // masterAdmin: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    role: {
      type: String,
      enum:['masterAdmin','Admin','user','guest'],
      required: true,
      default: "guest"
    },
    resetPassword: {
      type: Boolean,
      default: true,      
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
