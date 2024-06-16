import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({

    name:{type:String, required:true},
    hsnCode:{type:String, required:true},
    taxType:{type:String, required:true},
    gstRate:{type:String, required:true}
},{timestamps:true})

export default mongoose.model("item",itemSchema)