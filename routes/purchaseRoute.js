import express from "express";
import { createPurchase, deletePurchase, getAllPurchase, updatePurchase } from "../controllers/purchaseController.js";

const router = express.Router()

router.get('/', getAllPurchase)
router.post('/', createPurchase)
router.delete('/:_id', deletePurchase)
router.put('/:_id', updatePurchase)

export default router