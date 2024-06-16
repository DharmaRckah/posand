import supplierModel from "../models/supplierModel.js";

// Create supplier
export const createSupplier = async (req, res) => {
  const {
    supplierName,
    address,
    country,
    state,
    pinCode,
    contact,
    openingBalance,
    registrationType,
    gstIn,
    itemCategory = [],
    discount = [],
    accountNo,
    accountName,
    ifscCode,
    bankName,
  } = req.body;

  // Check for missing required fields
  const requiredFields = [
    "supplierName",
    "address",
    "country",
    "state",
    "pinCode",
    "contact",
    "openingBalance",
    "registrationType",
    "gstIn",
    "accountNo",
    "accountName",
    "ifscCode",
    "bankName",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).send({
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // Ensure itemCategory and discount are arrays
  const itemCategoryArray = Array.isArray(itemCategory) ? itemCategory : [itemCategory];
  const discountArray = Array.isArray(discount) ? discount : [discount];

  // Combine itemCategory and discount into a single array of objects
  const combinedArray = itemCategoryArray.map((category, index) => ({
    category,
    discount: discountArray[index] || '',
  }));

  try {
    const newsupplier = await supplierModel.create({
      supplierName,
      address,
      country,
      state,
      pinCode,
      contact,
      openingBalance,
      registrationType,
      gstIn,
      items: combinedArray, // Store combined array
      accountNo,
      accountName,
      ifscCode,
      bankName,
    });
    return res.status(201).send({
      success: true,
      message: "supplier registration completed successfully",
      data: newsupplier,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal issue",
      error: error.message,
    });
  }
};

// Get All suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.find();
    return res.status(200).send({
      success: true,
      message: "suppliers retrieved successfully",
      data: suppliers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal issue",
      error: error.message,
    });
  }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedsupplier = await supplierModel.findByIdAndDelete(_id);

    if (!deletedsupplier) {
      return res.status(404).send({
        success: false,
        message: "supplier not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "supplier deleted successfully",
      data: deletedsupplier,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal issue",
      error: error.message,
    });
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedsupplier = await supplierModel.findByIdAndUpdate(_id, updates, {
      new: true,
    });

    if (!updatedsupplier) {
      return res.status(404).send({
        success: false,
        message: "supplier not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "supplier updated successfully",
      data: updatedsupplier,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal issue",
      error: error.message,
    });
  }
};
