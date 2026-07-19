import mongoose from "mongoose";
import { WITHDRAWAL_STATUS } from "../constants/withdrawalStatus.js";

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(WITHDRAWAL_STATUS),
      default: WITHDRAWAL_STATUS.PENDING,
      index: true,
    },

    initiatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Withdrawal", withdrawalSchema);