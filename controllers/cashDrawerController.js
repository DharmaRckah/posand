import { isValidObjectId } from "mongoose";
import cashDrawerModel from "../models/cashDrawerModel.js";

export const createCashDrawerController = async (req, res) => {
  try {
    const { date, openingCash, cashIn, cashOut, closingCash } = req.body;

    const requiredField = [
      "date",
      "openingCash",
      "cashIn",
      "cashOut",
      "closingCash",
    ];

    const missingFields = [];
    for (const field of requiredField) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .send({ success: false, message: "required Fields ", missingFields });
    }

    const data = await cashDrawerModel.create({
      date,
      cashIn,
      cashOut,
      openingCash,
      closingCash,
    });
    if (data) {
      return res.send({
        success: true,
        message: "cashDrawer Created Successfully",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "internal server error", error });
  }
};

export const getCashDrawerController = async (req, res) => {
  try {
    const data = await cashDrawerModel.find({});
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
    return res.status.send({
      success: false,
      message: "some internal issue",
      error,
    });
  }
};

export const updateCashDrawerController = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.send({ success: false, message: "object id is not valide" });
    }
    const { date, cashIn, cashOut, openingCash, closingCash } = req.body;

    const ex = await cashDrawerModel.findById({ _id });
    if (!ex) {
      return res.send({
        success: false,
        message: "data not find in database ",
      });
    }

    const data = await cashDrawerModel.findOneAndUpdate(
      { _id },
      { date, cashIn, cashOut, openingCash, closingCash },
      { new: true }
    );
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: "data was not updated " });
    }
    if (data) {
      return res
        .status(200)
        .send({ success: true, message: "data updated successfully", data });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "internal server issue...!", error });
  }
};

export const deleteCashDrawerController = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.send({ message: "object id is not valid " });
    }

    const data = await cashDrawerModel.findByIdAndDelete(req.params._id);
    if (data) {
      return res.status(200).send({
        success: true,
        message: "data deleted successfully",
        data,
      });
    }
    if (!data) {
      return res.send({ success: false, message: "data not deleted " });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "some internal issue", error });
  }
};
