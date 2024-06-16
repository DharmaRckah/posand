import express from "express";
import { createCashDrawerController, deleteCashDrawerController, getCashDrawerController, updateCashDrawerController } from './../controllers/cashDrawerController.js';

const router = express.Router();

router.post("/createCashDrawer",createCashDrawerController)
router.get("/getCashDrawer",getCashDrawerController)
router.put("/updateCashDrawer/:_id",updateCashDrawerController)
router.delete("/deleteCashDrawer/:_id",deleteCashDrawerController)

export default router ;
