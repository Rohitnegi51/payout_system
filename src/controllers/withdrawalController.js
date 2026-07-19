import { initiateWithdrawal } from "../services/withdrawalService.js";

export const createWithdrawal = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const withdrawal = await initiateWithdrawal(
            userId,
            amount
        );

        return res.status(201).json({
            success: true,
            data: withdrawal,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};