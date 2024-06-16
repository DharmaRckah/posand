import mongoose from "mongoose";

const stockDetailSchema = new mongoose.Schema({
  quantity: { type: String, required: true },
  rate: { type: String, required: true },
  unit: { type: String, required: true },
  amount: { type: String, required: true },
});

const stockSchema = new mongoose.Schema(
  {
    // product info
    productName: { type: String, required: true },
    productCode: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    enableBatch: { type: Boolean, required: true },
    batchNumber: { type: String },
    enableExpiry: { type: Boolean, required: true },
    expiryDate: { type: Date },
    manufacturer: { type: String, required: true },
    hsnCode: { type: String, required: true },
    taxType: { type: String, required: true },
    gstRate: { type: Number, required: true },
    // price details
    purchasePriceExcludeGst: { type: Number, required: true },
    purchasePriceInclusiveGst: { type: Number, required: true },
    mrp: { type: Number, required: true },
    salePriceExcludeGst: { type: Number, required: true },
    salePriceInclusiveGst: { type: Number, required: true },
    discountPercent: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    wholesalePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    stockDetail: [stockDetailSchema],
    productPhoto: { type: String, required: true },
    productFeatures: { type: String, required: true },
    description: { type: String, required: true },
    serialNumber: { type: String, required: true },
    barCode: { type: String, required: true },
    minimumStock: { type: Number, required: true },
    maximumStock: { type: Number, required: true },
  },
  { timestamps: true }
);

const stockModel = mongoose.model("stock", stockSchema);

export default stockModel;
