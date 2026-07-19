import Sale from "../models/Sale.js";
import User from "../models/User.js";

export const createSaleService = async (saleData) => {
    const { userId, brand, earning } = saleData;

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    const sale = await Sale.create({
        userId,
        brand,
        earning,
    });

    return sale;
};

export const getAllSalesService = async () => {
    return await Sale.find().populate("userId");
};