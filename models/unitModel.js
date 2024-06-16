import mongoose from "mongoose";
const unitSchema = mongoose.Schema({
    unitSymbol:{
        type:String,
        required:true
    },
    formalName:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    }
})

export default mongoose.model('unit',unitSchema)