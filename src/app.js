import express from "express";
import saleRoutes from "./routes/saleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";



const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Affiliate Payout System API"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/withdrawals", withdrawalRoutes);

export default app;