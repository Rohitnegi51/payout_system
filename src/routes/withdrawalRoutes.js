import express from "express";

import { createWithdrawal } from "../controllers/withdrawalController.js";

const router = express.Router();

router.post("/", createWithdrawal);

export default router;