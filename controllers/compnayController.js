import companyModel from "../models/companyModel.js";
import multer from "multer";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { isValidObjectId } from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error:Images Only.!");
    }
  },
}).single("companyLogo");

export const createCompanyController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ error: err.message, err });
    }

    try {
      const {
        businessName,
        address,
        state,
        country,
        pinCode,
        contact,
        email,
        website,
        financialYear,
        bookFrom,
        enableGst,
        s_state,
        registrationType,
        taxRate,
        calculateTaxBasedOn,
        gstIn,
      } = req.body;

      const companyLogo = req.file ? req.file.path : "";

      const requiredField = [
        "companyLogo",
        "businessName",
        "address",
        "state",
        "country",
        "pinCode",
        "contact",
        "email",
        "website",
        "financialYear",
        "bookFrom",
        "enableGst",
        "s_state",
        "registrationType",
        "taxRate",
        "calculateTaxBaseOn",
        "gstIn",
      ];
      const missingFeilds = [];
      for (const field of requiredField) {
        if (!req.body[field] && !req.file) {
          missingFeilds.push(field);
        }
      }
      if (missingFeilds.length > 0) {
        return res.status(400).send({
          success: false,
          message: "these fields are required",
          missingFeilds,
        });
      }
      const data = await companyModel.create({
        companyLogo,
        businessName,
        address,
        state,
        country,
        pinCode,
        contact,
        email,
        website,
        financialYear,
        bookFrom,
        enableGst,
        s_state,
        registrationType,
        taxRate,
        calculateTaxBasedOn,
        gstIn,
      });

      if (data) {
        return res.status(201).send({
          success: true,
          message: "Company registration Complete  Successfully ",
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "internal issue",
        Error: error.message,
      });
    }
  });
};

export const getCompanyController = async (req, res) => {
  try {
    const data = await companyModel.find({});
    if (data) {
      return res.status(200).send({
        success: true,
        message: "company data find successfully",
        data,
      });
    }
    if (!data) {
      return res.status(400).send({
        success: false,
        message: "not found data",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "some internal issue ", error });
  }
};

export const updateCompanyController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    try {
      const { _id } = req.params;
      if (!isValidObjectId(_id)) {
        return res.status(400).send({
          success: false,
          message: "Object ID is not valid",
          _id,
        });
      }

      const ex = await companyModel.findById({ _id });
      if (!ex) {
        return res.status(400).send({
          success: false,
          message: "Company data not found...!",
        });
      }

      const updateData = { ...req.body };
      if (req.file) {
        if (ex.companyLogo && fs.existsSync(ex.companyLogo)) {
          fs.unlinkSync(ex.companyLogo);
        }
        updateData.companyLogo = req.file.path;
      }
      const data = await companyModel.findByIdAndUpdate(_id, updateData, {
        new: true,
      });
      if (data) {
        return res.send({
          success: true,
          message: "Data updated successfully",
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Some internal issue",
        error,
      });
    }
  });
};

export const deleteCompanyController = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.status(400).send({
        success: false,
        message: "Object ID is not valid",
        _id,
      });
    }

    const company = await companyModel.findById(_id);
    if (!company) {
      return res.status(400).send({
        success: false,
        message: "Company data not found...!",
      });
    }

    if (company.companyLogo && fs.existsSync(company.companyLogo)) {
      fs.unlinkSync(company.companyLogo);
    }

    await companyModel.findByIdAndDelete(_id);

    return res.status(200).send({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Some internal issue",
      error,
    });
  }
};
