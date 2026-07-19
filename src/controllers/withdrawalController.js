import {
    initiateWithdrawal,
    recoverFailedWithdrawal,
} from "../services/withdrawalService.js";

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

export const recoverWithdrawal = async (req, res) => {
    try {

        const { withdrawalId, status } = req.body;

        const withdrawal =
            await recoverFailedWithdrawal(
                withdrawalId,
                status
            );

        return res.json({
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