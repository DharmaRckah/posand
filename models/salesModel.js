import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema(
  {
    billingBy: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    gstIn: {
      type: String,
      required: true,
    },
    billingTo: {
      type: String,
      required: true,
    },
    addressTo: {
      type: String,
      required: true,
    },
    contactTo: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    table: [
      {
        barCode: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        batchNo: {
          type: String,
          required: true,
        },
        expiry: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const salesModel = mongoose.model('Sale', salesSchema);

export default salesModel;
