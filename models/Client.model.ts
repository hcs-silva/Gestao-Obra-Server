import { Schema, model } from "mongoose";
import { profile } from "node:console";

const clientSchema = new Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  clientLogo: { type: String },
  clientAdmin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  Members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Client = model("Client", clientSchema);

export default Client;
