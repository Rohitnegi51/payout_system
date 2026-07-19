import mongoose from "mongoose";

import Sale from "../models/Sale.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { SALE_STATUS } from "../constants/saleStatus.js";
import {
    TRANSACTION_TYPE,
    LEDGER_ENTRY,
} from "../constants/transactionTypes.js";

export const processAdvancePayout = async () => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const eligibleSales = await Sale.find({
            status: SALE_STATUS.PENDING,
            advancePaid: false,
        }).session(session);

        let processed = 0;

        for (const sale of eligibleSales) {

            const advanceAmount = sale.earning * 0.10;

            await User.findByIdAndUpdate(
                sale.userId,
                {
                    $inc: {
                        walletBalance: advanceAmount,
                        totalAdvanceReceived: advanceAmount,
                    },
                },
                { session }
            );

            await Transaction.create(
                [
                    {
                        userId: sale.userId,
                        saleId: sale._id,
                        type: TRANSACTION_TYPE.ADVANCE,
                        transactionType: LEDGER_ENTRY.CREDIT,
                        amount: advanceAmount,
                        description: "10% Advance Payout",
                    },
                ],
                { session }
            );

            sale.advancePaid = true;
            sale.advanceAmount = advanceAmount;

            await sale.save({ session });

            processed++;
        }

        await session.commitTransaction();

        return {
            processed,
        };
    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }
};