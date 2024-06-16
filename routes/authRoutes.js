import express from "express";
import { forgetController, loginController, resetPasswordController, userRegisterController, verificationController } from "../controllers/authController.js";
import { mailController } from "../middleware/mailController.js";

const router=express.Router();

router.post('/register', userRegisterController)
router.post('/mail',mailController)
router.post('/verification',verificationController )
router.post('/login',loginController)
router.post('/forget',forgetController)
router.post('/resetPassword',resetPasswordController)
export default router 
