import {
    createSaleService,
    getAllSalesService,
} from "../services/saleService.js";

export const createSale = async (req, res) => {
    try {
        const sale = await createSaleService(req.body);

        return res.status(201).json({
            success: true,
            message: "Sale created successfully.",
            data: sale,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllSales = async (req, res) => {
    try {
        const sales = await getAllSalesService();

        return res.status(200).json({
            success: true,
            count: sales.length,
            data: sales,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};