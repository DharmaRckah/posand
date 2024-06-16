import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true,
    }
},{timestamps:true})

export default mongoose.model("category",categorySchema)