const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
  ClientName: { type: String, required: true, trim: true, lowercase: true, unique: true },
  ClientAdmin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  Members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Client = model("Client", clientSchema);

module.exports = Client;
