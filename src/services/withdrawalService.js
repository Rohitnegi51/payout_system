import mongoose from "mongoose";

import User from "../models/User.js";
import Withdrawal from "../models/Withdrawal.js";
import Transaction from "../models/Transaction.js";

import {
    TRANSACTION_TYPE,
    LEDGER_ENTRY,
} from "../constants/transactionTypes.js";

import { WITHDRAWAL_STATUS } from "../constants/withdrawalStatus.js";

export const initiateWithdrawal = async (userId, amount) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(userId).session(session);

        if (!user) {
            throw new Error("User not found.");
        }

        if (user.walletBalance < amount) {
            throw new Error("Insufficient wallet balance.");
        }

        const lastWithdrawal = await Withdrawal.findOne({
            userId,
        })
            .sort({ createdAt: -1 })
            .session(session);

        if (lastWithdrawal) {
            const diff =
                Date.now() -
                new Date(lastWithdrawal.createdAt).getTime();

            const HOURS_24 = 24 * 60 * 60 * 1000;

            if (diff < HOURS_24) {
                throw new Error(
                    "Only one withdrawal is allowed every 24 hours."
                );
            }
        }

        user.walletBalance -= amount;

        await user.save({ session });

        const withdrawal = await Withdrawal.create(
            [
                {
                    userId,
                    amount,
                    status: WITHDRAWAL_STATUS.PENDING,
                },
            ],
            { session }
        );

        await Transaction.create(
            [
                {
                    userId,
                    type: TRANSACTION_TYPE.WITHDRAWAL,
                    transactionType: LEDGER_ENTRY.DEBIT,
                    amount,
                    description: "Withdrawal initiated",
                },
            ],
            { session }
        );

        await session.commitTransaction();

        return withdrawal[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const recoverFailedWithdrawal = async (
    withdrawalId,
    status
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const withdrawal = await Withdrawal.findById(withdrawalId).session(
            session
        );

        if (!withdrawal) {
            throw new Error("Withdrawal not found.");
        }

        if (withdrawal.status !== WITHDRAWAL_STATUS.PENDING) {
            throw new Error("Withdrawal has already been processed.");
        }

        if (
            ![
                WITHDRAWAL_STATUS.FAILED,
                WITHDRAWAL_STATUS.REJECTED,
                WITHDRAWAL_STATUS.CANCELLED,
            ].includes(status)
        ) {
            throw new Error("Invalid recovery status.");
        }

        withdrawal.status = status;
        await withdrawal.save({ session });

        await User.findByIdAndUpdate(
            withdrawal.userId,
            {
                $inc: {
                    walletBalance: withdrawal.amount,
                },
            },
            { session }
        );

        await Transaction.create(
            [
                {
                    userId: withdrawal.userId,
                    type: TRANSACTION_TYPE.WITHDRAWAL_REFUND,
                    transactionType: LEDGER_ENTRY.CREDIT,
                    amount: withdrawal.amount,
                    description: "Refund for failed withdrawal",
                },
            ],
            { session }
        );

        await session.commitTransaction();

        return withdrawal;

    } catch (error) {

        await session.abortTransaction();
        throw error;

    } finally {

        session.endSession();

    }
};