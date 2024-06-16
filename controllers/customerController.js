import CustomerModel from "../models/customerModel.js";

// Create Customer
export const createCustomer = async (req, res) => {
  const {
    customerName,
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
    "customerName",
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
    const newCustomer = await CustomerModel.create({
      customerName,
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
      message: "Customer registration completed successfully",
      data: newCustomer,
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

// Get All Customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find();
    return res.status(200).send({
      success: true,
      message: "Customers retrieved successfully",
      data: customers,
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

// Delete Customer
export const deleteCustomer = async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedCustomer = await CustomerModel.findByIdAndDelete(_id);

    if (!deletedCustomer) {
      return res.status(404).send({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Customer deleted successfully",
      data: deletedCustomer,
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

// Update Customer
export const updateCustomer = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(_id, updates, {
      new: true,
    });

    if (!updatedCustomer) {
      return res.status(404).send({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
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
