import { Schema, model } from "mongoose";


const clientSchema = new Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  clientEmail: { type: String, trim: true, lowercase: true, unique: true },
  clientPhone: { type: String, trim: true, unique: true },
  clientLogo: { type: String },
  clientAdmin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  Members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Client = model("Client", clientSchema);

export default Client;
