import express from "express";

import { reconcile } from "../controllers/adminController.js";

const router = express.Router();

router.post("/reconcile", reconcile);

export default router;