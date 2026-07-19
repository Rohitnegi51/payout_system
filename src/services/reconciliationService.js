import mongoose from "mongoose";

import Sale from "../models/Sale.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { SALE_STATUS } from "../constants/saleStatus.js";
import {
    TRANSACTION_TYPE,
    LEDGER_ENTRY,
} from "../constants/transactionTypes.js";

export const reconcileSales = async (sales) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        for (const item of sales) {
            const sale = await Sale.findById(item.saleId).session(session);

            if (!sale) {
                throw new Error(`Sale ${item.saleId} not found.`);
            }

            if (sale.reconciled) {
                continue;
            }

            sale.status = item.status;
            sale.reconciled = true;

            if (item.status === SALE_STATUS.APPROVED) {

                const remainingAmount =
                    sale.earning - sale.advanceAmount;

                await User.findByIdAndUpdate(
                    sale.userId,
                    {
                        $inc: {
                            walletBalance: remainingAmount,
                            totalFinalPayoutReceived: remainingAmount,
                        },
                    },
                    { session }
                );

                await Transaction.create(
                    [
                        {
                            userId: sale.userId,
                            saleId: sale._id,
                            type: TRANSACTION_TYPE.FINAL_PAYOUT,
                            transactionType: LEDGER_ENTRY.CREDIT,
                            amount: remainingAmount,
                            description: "Final payout after approval",
                        },
                    ],
                    { session }
                );
            } else {

                if (sale.advanceAmount > 0) {

                    await User.findByIdAndUpdate(
                        sale.userId,
                        {
                            $inc: {
                                walletBalance: -sale.advanceAmount,
                            },
                        },
                        { session }
                    );

                    await Transaction.create(
                        [
                            {
                                userId: sale.userId,
                                saleId: sale._id,
                                type: TRANSACTION_TYPE.ADJUSTMENT,
                                transactionType: LEDGER_ENTRY.DEBIT,
                                amount: sale.advanceAmount,
                                description:
                                    "Advance adjusted due to rejected sale",
                            },
                        ],
                        { session }
                    );
                }
            }

            await sale.save({ session });
        }

        await session.commitTransaction();

        return {
            success: true,
        };

    } catch (error) {

        await session.abortTransaction();
        throw error;

    } finally {

        session.endSession();

    }
};