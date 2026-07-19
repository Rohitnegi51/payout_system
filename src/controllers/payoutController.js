import { processAdvancePayout } from "../services/payoutService.js";

export const advancePayout = async (req, res) => {
    try {

        const result = await processAdvancePayout();

        return res.status(200).json({
            success: true,
            message: "Advance payout completed successfully.",
            data: result,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};