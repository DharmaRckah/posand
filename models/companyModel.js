import mongoose from "mongoose"
const companySchema =  mongoose.Schema({
//Business Details
   companyLogo:{
    type:String,
    required:true,
   },

    businessName:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    pinCode:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        required:true,

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
    },
    website:{
        type:String,
        required:true,
    },
    financialYear:{
        type:String,
        required:true,
    },
    bookFrom:{
        type:String,
        required:true,
    },


    //statutory details 
    enableGst:{
        type:String,
        required:true,
    },
    s_state:{
        type:String,
        required:true,
    },
    registrationType:{
        type:String,
        required:true,
    },

    taxRate:{
        type:String,
        required:true,
    },
    calculateTaxBasedOn:{
        type:String,
        required:true,
        default:"Taxable value"
    },
    gstIn:{
        type:String,
        required:true,
    },
  

},{timestamps:true})

export default mongoose.model("company",companySchema)