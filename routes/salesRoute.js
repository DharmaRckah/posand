import express from "express";
import { createSales, deleteSales, getAllSales, updateSales } from "../controllers/salesController.js";

const router = express.Router()

router.get('/', getAllSales)
router.post('/', createSales)
router.delete('/:_id', deleteSales)
router.put('/:_id', updateSales)

export default router