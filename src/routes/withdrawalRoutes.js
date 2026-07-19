import express from "express";

import {
    createWithdrawal,
    recoverWithdrawal,
} from "../controllers/withdrawalController.js";

const router = express.Router();

router.post("/", createWithdrawal);
router.post("/recover", recoverWithdrawal);

export default router;