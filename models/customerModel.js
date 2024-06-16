import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  category: { type: String, required: false },
  discount: { type: String, required: false },
});

const customerModel = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    contact: { type: String, required: true },
    openingBalance: { type: Number, required: true },
    registrationType: { type: String, required: true },
    gstIn: { type: String, required: true },
    items: { type: [itemSchema], required: true },
    accountNo: { type: String, required: true },
    accountName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("customer", customerModel);
