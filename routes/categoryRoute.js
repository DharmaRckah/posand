import express from "express";
import { addCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add-category',requireSignIn,isAdmin,addCategoryController)
router.get('/get-category',requireSignIn,isAdmin,getCategoryController)
router.put('/updateCategory/:id',requireSignIn,isAdmin,updateCategoryController)
router.delete('/deleteCategory/:id',requireSignIn,isAdmin,deleteCategoryController)
export default router;