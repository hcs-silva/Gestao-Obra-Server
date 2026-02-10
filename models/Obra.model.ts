import { Schema, model } from "mongoose";

const obraSchema = new Schema(
  {
    obraName: {
      type: String,
      required: true,
      trim: true,
    },
    obraDescription: {
      type: String,
      trim: true,
    },
    obraLocation: {
      type: String,
      trim: true,
    },
    obraStatus: {
      type: String,
      enum: ["planning", "in-progress", "completed", "on-hold"],
      default: "planning",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    responsibleUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Obra = model("Obra", obraSchema);

export default Obra;
