import categoryModel from "../models/categoryModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { isValidObjectId } from "mongoose";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('img');

export const addCategoryController = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
           
            return res.status(400).send({ error: err.message ,err});
        }
   
        const { name } = req.body;
        const img = req.file ? req.file.path : '';

        if (!name || !img) {
            return res.status(400).send({ error: 'Name and image are required.' });
        }

        try {
            const newCategory = new categoryModel({ name, img });
            const savedCategory = await newCategory.save();
            res.status(201).send({ message: 'Category added successfully', category: savedCategory });
        } catch (error) {
            res.status(500).send({ error: 'Server error' });
        }
    });
};


export const getCategoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).send({ message: 'Categories retrieved successfully', categories });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
};



export const updateCategoryController = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).send({ success: false, message: "Invalid object ID" });
        }

        const { name } = req.body;
        const img = req.file ? req.file.path : '';

        if (!name && !img) {
            return res.status(400).send({ error: 'At least one of name or image is required.' });
        }

        try {
            const category = await categoryModel.findById(id);
            if (!category) {
                return res.status(404).send({ success: false, error: 'Category not found' });
            }

            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (img) {
              
                if (category.img) {
                    const oldImagePath = path.join(__dirname, '..', category.img);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('Failed to delete old image file:', err);
                        }
                    });
                }
                updatedFields.img = img;
            }

            const updatedCategory = await categoryModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedCategory) {
                return res.status(400).send({ success: false, error: 'Category not found' });
            }

            res.status(200).send({ success: true, message: "Category updated successfully", category: updatedCategory });

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    });
};


export const deleteCategoryController = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        const { id } = req.params;

        try {
            const category = await categoryModel.findById(id);
            if (!category) {
                return res.status(404).send({ success: false, error: 'Category not found' });
            }

          
            if (category.img) {
                const imagePath = path.join(__dirname, '..', category.img);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete image file:', err);
                    }
                });
            }

            await categoryModel.findByIdAndDelete(id);

            res.status(200).send({ success: true, message: "Category deleted successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).send({ success: false, message: "Internal error" });
        }
    });
};

    