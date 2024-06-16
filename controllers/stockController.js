import stockModel from "../models/stockModel.js";
import unitModel from "../models/unitModel.js";
import categoryModel from "../models/itemModel.js";
import { fileURLToPath } from "url";
import path from "path";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE stock
export const createStock = async (req, res) => {
  const {
    productName,
    productCode,
    category,
    unit,
    enableBatch,
    batchNumber,
    enableExpiry,
    expiryDate,
    manufacturer,
    hsnCode,
    taxType,
    gstRate,
    purchasePriceExcludeGst,
    purchasePriceInclusiveGst,
    mrp,
    salePriceExcludeGst,
    salePriceInclusiveGst,
    discountPercent,
    discountAmount,
    wholesalePrice,
    retailPrice,
    stockDetail,
    productFeatures,
    description,
    serialNumber,
    barCode,
    minimumStock,
    maximumStock,
    productPhoto
  } = req.body;

  const requiredFields = [
    'productName', 'productCode', 'category', 'unit', 'enableBatch', 'batchNumber',
    'enableExpiry', 'expiryDate', 'manufacturer', 'hsnCode', 'taxType', 'gstRate',
    'purchasePriceExcludeGst', 'purchasePriceInclusiveGst', 'mrp', 'salePriceExcludeGst',
    'salePriceInclusiveGst', 'discountPercent', 'discountAmount', 'wholesalePrice',
    'retailPrice', 'stockDetail', 'productFeatures', 'description', 'serialNumber',
    'barCode', 'minimumStock', 'maximumStock','productPhoto'
  ];

  // Check for missing fields
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    console.error(`Missing fields: ${missingFields.join(', ')}`);
    return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
  }

  try {
    // Check if unit exists
    const unitExists = await unitModel.findOne({ formalName: unit });
    if (!unitExists) {
      console.error('Unit not found');
      return res.status(400).json({ message: 'Unit not found' });
    }

    // Check if category exists
    const categoryExists = await categoryModel.findOne({ name: category });
    if (!categoryExists) {
      console.error('Category not found');
      return res.status(400).json({ message: 'Category not found' });
    }

    // Create new stock entry
    const newStock = new stockModel({
      productName,
      productCode,
      category,
      unit,
      enableBatch,
      batchNumber,
      enableExpiry,
      expiryDate,
      manufacturer,
      hsnCode,
      taxType,
      gstRate,
      purchasePriceExcludeGst,
      purchasePriceInclusiveGst,
      mrp,
      salePriceExcludeGst,
      salePriceInclusiveGst,
      discountPercent,
      discountAmount,
      wholesalePrice,
      retailPrice,
      stockDetail,
      productFeatures,
      description,
      serialNumber,
      barCode,
      minimumStock,
      maximumStock,
      productPhoto
    });

    const savedStock = await newStock.save();
    res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      stock: savedStock,
    });
  } catch (error) {
    console.error('Error creating stock:', error.message);
    res.status(500).json({ message: 'Failed to create stock', error: error.message });
  }
};

// UPDATE - PUT /stocks/:id
export const updateStock = async (req, res) => {
  const { _id } = req.params;

  const {
    productName,
    productCode,
    category,
    unit,
    enableBatch,
    batchNumber,
    enableExpiry,
    expiryDate,
    manufacturer,
    hsnCode,
    taxType,
    gstRate,
    purchasePriceExcludeGst,
    purchasePriceInclusiveGst,
    mrp,
    salePriceExcludeGst,
    salePriceInclusiveGst,
    discountPercent,
    discountAmount,
    wholesalePrice,
    retailPrice,
    stockDetail,
    productFeatures,
    description,
    serialNumber,
    barCode,
    minimumStock,
    maximumStock,
    productPhoto
  } = req.body;

  try {
    // Check if unit exists
    const unitExists = await unitModel.findOne({ formalName: unit });
    if (!unitExists) {
      return res.status(400).json({ message: "Unit not found" });
    }

    // Check if category exists
    const categoryExists = await categoryModel.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Find the stock item by id
    const stockItem = await stockModel.findById(_id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Update the stock item
    const updatedStock = await stockModel.findByIdAndUpdate(
      _id,
      {
        productName,
        productCode,
        category,
        unit,
        enableBatch,
        batchNumber,
        enableExpiry,
        expiryDate,
        manufacturer,
        hsnCode,
        taxType,
        gstRate,
        purchasePriceExcludeGst,
        purchasePriceInclusiveGst,
        mrp,
        salePriceExcludeGst,
        salePriceInclusiveGst,
        discountPercent,
        discountAmount,
        wholesalePrice,
        retailPrice,
        stockDetail,
        productFeatures,
        description,
        serialNumber,
        barCode,
        minimumStock,
        maximumStock,
        productPhoto
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      stock: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock:", error.message);
    res.status(500).json({ message: "Failed to update stock", error: error.message });
  }
};

// READ - GET /stocks
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await stockModel.find();
    res.status(200).json({ success: true, stocks });
  } catch (error) {
    console.error("Error retrieving stocks:", error.message);
    res.status(500).json({ message: "Failed to retrieve stocks", error: error.message });
  }
};

// DELETE - DELETE /stocks/:id
export const deleteStock = async (req, res) => {
  const { _id } = req.params;

  try {
    // Check if the stock item exists
    const stockItem = await stockModel.findById(_id);
    if (!stockItem) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Delete the stock item
    await stockModel.findByIdAndDelete(_id);

    res.status(200).json({ success: true, message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error.message);
    res.status(500).json({ message: 'Failed to delete stock', error: error.message });
  }
};
