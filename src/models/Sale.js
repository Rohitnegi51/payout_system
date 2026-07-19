import mongoose from "mongoose";
import { BRANDS } from "../constants/brands.js";
import { SALE_STATUS } from "../constants/saleStatus.js";

const saleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        brand: {
            type: String,
            enum: BRANDS,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(SALE_STATUS),
            default: SALE_STATUS.PENDING,
            index: true,
        },

        earning: {
            type: Number,
            required: true,
            min: 0,
        },

        advancePaid: {
            type: Boolean,
            default: false,
            index: true,
        },

        advanceAmount: {
            type: Number,
            default: 0,
        },

        reconciled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Sale", saleSchema);