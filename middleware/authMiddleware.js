import  jsonwebtoken  from "jsonwebtoken";
import JWT from "jsonwebtoken"

import userModel from "../models/userModel.js";


export const requireSignIn = async(req,res,next)=>{
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "Authorization header not found" });
        }

        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET)
       

        if (!decode) {
            return res.status(401).send({ message: "Invalid token" });
        }
        req.user = decode;
        
    
        next();

    } catch (error) {
      
        return res.status(401).send({message:"UnAuthorized "})
    }
}

export const isAdmin=async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role!==1){
            return res.status(401).send({
                success:false,message:"UnAuthorized"
            })
        }
        else{
            next();
        }
    } catch (error) {
        res.status(500).send({success:false,message:"internal server issue",error})
        
    }
}


