import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    totalAdvanceReceived: {
      type: Number,
      default: 0,
    },

    totalFinalPayoutReceived: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);