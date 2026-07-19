import { reconcileSales } from "../services/reconciliationService.js";

export const reconcile = async (req, res) => {

    try {

        const result = await reconcileSales(req.body.sales);

        return res.json({
            success: true,
            data: result,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};