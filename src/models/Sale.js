import mongoose from "mongoose";

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
            enum: ["brand_1", "brand_2", "brand_3"],
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
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