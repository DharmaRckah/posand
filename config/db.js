import mongoose from "mongoose";
const connectDb = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Database Connected Successfully on ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`MongoDb Database Connection Failed ${error}`)
        
    }
}
export default connectDb;
