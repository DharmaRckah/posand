import unitModel from "../models/unitModel.js";
import { isValidObjectId } from 'mongoose';

export const createUnit = async (req, res) => {
  try {
    const { unitSymbol, formalName, code } = req.body;
    const requiredField = ["unitSymbol", "formalName", "code"];

    const missingFields = [];
    for (const field of requiredField) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      return res.status(400).send({
        success: false,
        message: "requireds are missing",
        missingFields,
      });
    }
    const data = await unitModel.create({
      unitSymbol,
      formalName,
      code,
    });
    if (data) {
      return res.send({
        success: true,
        message: "unit created successfully",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "internal server error",
      error,
    });
  }
};

export const getUint = async (req, res) => {
  try {
    const data = await unitModel.find({});
    if (!data) {
      return res.send({ success: false, message: "data not find " });
    }
    if (data) {
      return res
        .status(200)
        .send({ success: true, message: "data find successfully.", data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "some internal issue",
      error,
    });
  }
};
// Update Unit
export const updateUnit = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ObjectId" });
    }

    const { unitSymbol, formalName, code } = req.body;
    if (!unitSymbol || !formalName || !code) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }

    const exist = await unitModel.findById(_id);
    if (!exist) {
      return res
        .status(404)
        .send({ success: false, message: "Unit not found" });
    }

    const data = await unitModel.findByIdAndUpdate(
      _id,
      { unitSymbol, formalName, code },
      { new: true }
    );

    if (!data) {
      return res
        .status(500)
        .send({ success: false, message: "Unit update failed" });
    } else {
      return res
        .status(200)
        .send({ success: true, message: "Unit updated successfully", data });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error", error });
  }
};

// Delete Unit
export const deleteUnit = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ObjectId" });
    }

    const data = await unitModel.findByIdAndDelete(_id);
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: "Unit not found" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Unit deleted successfully", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error", error });
  }
};
