import express from 'express';
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '../controllers/customerController.js';

const router = express.Router();

// Route to create a customer
router.post('/', createCustomer);

// Route to get all customers
router.get('/', getCustomers);

// Route to delete a customer
router.delete('/:_id', deleteCustomer)

// Route to update a  customer
router.put('/:_id', updateCustomer)

export default router;
