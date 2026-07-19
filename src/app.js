import express from "express";
import saleRoutes from "./routes/saleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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


export default app;