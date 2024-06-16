import mongoose from "mongoose";

const cashSchema = new mongoose.Schema({
    date:{
        type:Date,
         required:true,
        },
    openingCash:{
        type:Number,
        required:true,

    },
    cashIn:{
        type:Number,
        required:true,
    },
    cashOut:{
        type:Number,
        required:true,
    },
    closingCash:{
        type:Number,
        required:true,
    }

},



{
    timestamps:true,
})

export default mongoose.model("cashdrawer",cashSchema)
