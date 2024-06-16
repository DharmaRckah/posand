import purchaseModel from '../models/purchaseModel.js';

// CREATE - POST /purchase
export const createPurchase = async (req, res) => {
  try {
    const {
      billingBy,
      address,
      contact,
      gstIn,
      billingTo,
      addressTo,
      contactTo,
      date,
      invoiceNo,
      table, // Assuming this is an array of table entries
    } = req.body;

    // Check for required fields
    if (
      !billingBy ||
      !address ||
      !contact ||
      !gstIn ||
      !billingTo ||
      !addressTo ||
      !contactTo ||
      !date ||
      !invoiceNo ||
      !table ||
      !Array.isArray(table) ||
      table.length === 0
    ) {
      return res.status(400).json({ message: 'All fields are required, including the table entries' });
    }

    const newSale = new purchaseModel({
      billingBy,
      address,
      contact,
      gstIn,
      billingTo,
      addressTo,
      contactTo,
      date,
      invoiceNo,
      table, // Save the table entries as an array
    });

    const savedSale = await newSale.save();
    res.status(201).json({ success: true, message: 'Sale created successfully', sale: savedSale });
  } catch (error) {
    console.error('Error creating sale:', error.message);
    res.status(500).json({ message: 'Failed to create sale', error: error.message });
  }
};

// READ - GET /purchase
export const getAllPurchase = async (req, res) => {
  try {
    const purchase = await purchaseModel.find();
    res.status(200).json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error.message);
    res.status(500).json({ message: 'Failed to fetch purchase', error: error.message });
  }
};

// UPDATE - PUT /purchase/:id
export const updatePurchase = async (req, res) => {
  const { _id } = req.params;  // Use `id` instead of `_id` to match the route parameter
  try {
    const {
      billingBy,
      address,
      contact,
      gstIn,
      billingTo,
      addressTo,
      contactTo,
      date,
      invoiceNo,
      table, // Assuming this is an array of table entries
    } = req.body;

    // Check for required fields
    if (
      !billingBy ||
      !address ||
      !contact ||
      !gstIn ||
      !billingTo ||
      !addressTo ||
      !contactTo ||
      !date ||
      !invoiceNo ||
      !table ||
      !Array.isArray(table) ||
      table.length === 0
    ) {
      return res.status(400).json({ message: 'All fields are required, including the table entries' });
    }

    const updatedData = {
      billingBy,
      address,
      contact,
      gstIn,
      billingTo,
      addressTo,
      contactTo,
      date,
      invoiceNo,
      table, // Update the table entries as an array
    };

    const updatedSale = await purchaseModel.findByIdAndUpdate(_id, updatedData, { new: true });

    if (!updatedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({ success: true, message: 'Sale updated successfully', sale: updatedSale });
  } catch (error) {
    console.error('Error updating sale:', error.message);
    res.status(500).json({ message: 'Failed to update sale', error: error.message });
  }
};


// DELETE - DELETE /purchase/:id
export const deletePurchase = async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedSale = await purchaseModel.findByIdAndDelete(_id);
    if (!deletedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ success: true, message: 'Sale deleted successfully', deletedSale});
  } catch (error) {
    console.error('Error deleting sale:', error.message);
    res.status(500).json({ message: 'Failed to delete sale', error: error.message });
  }
};
