import mongoose from "mongoose";
import {
  TRANSACTION_TYPE,
  LEDGER_ENTRY,
  TRANSACTION_STATUS,
} from "../constants/transactionTypes.js";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      default: null,
    },

    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: true,
    },

    transactionType: {
      type: String,
      enum: Object.values(LEDGER_ENTRY),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.SUCCESS,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);
