import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  clientEmail: { type: String, trim: true, lowercase: true },
  clientPhone: { type: String, trim: true },
  clientLogo: { type: String },
  clientAdmin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subStatus: { type: Boolean, default: false },
  Members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Create unique indexes with partial filter expressions to allow multiple null values
clientSchema.index(
  { clientEmail: 1 },
  {
    unique: true,
    partialFilterExpression: { clientEmail: { $type: "string" } },
  },
);

clientSchema.index(
  { clientPhone: 1 },
  {
    unique: true,
    partialFilterExpression: { clientPhone: { $type: "string" } },
  },
);

const Client = model("Client", clientSchema);

export default Client;
