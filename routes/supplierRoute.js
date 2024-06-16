import express from 'express';
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from '../controllers/supplierController.js';

const router = express.Router();

// Route to create a Supplier
router.post('/', createSupplier);

// Route to get all Suppliers
router.get('/', getSuppliers);

// Route to delete a Supplier
router.delete('/:_id', deleteSupplier)

// Route to update a  Supplier
router.put('/:_id', updateSupplier)

export default router;
