import express from "express";

import { advancePayout } from "../controllers/payoutController.js";

const router = express.Router();

router.post("/advance", advancePayout);

export default router;