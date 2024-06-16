import express from "express";
import { createCompanyController, deleteCompanyController, getCompanyController, updateCompanyController } from "../controllers/compnayController.js";

const router = express.Router();
router.post("/createCom",createCompanyController)
router.get("/getCompany",getCompanyController)
router.put("/updateCompany/:_id",updateCompanyController)
router.delete("/deleteCompany/:_id",deleteCompanyController)


export default router;