import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoute.js";
import cashDrawerRoute from "./routes/cashDrawerRoute.js";
import companyRoute from "./routes/companyRoute.js";
import customerRoute from "./routes/customerRoute.js";
import supplierRoute from "./routes/supplierRoute.js"
import salesRoute from "./routes/salesRoute.js"
import purchaseRoute from "./routes/purchaseRoute.js"
import itemRoute from "./routes/itemRoute.js"
import stockRoute from "./routes/stockRoute.js"
import unitRoute from "./routes/unitRoute.js"
import uploadRoute from "./routes/uploadRoute.js"

dotenv.config();

connectDb();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", uploadRoute )
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/cashDrawer", cashDrawerRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/supplier", supplierRoute)
app.use("/api/v1/sales", salesRoute)
app.use("/api/v1/purchase", purchaseRoute)
app.use("/api/v1/item", itemRoute)
app.use("/api/v1/stock", stockRoute)
app.use("/api/v1/unit", unitRoute)
 

app.listen(process.env.PORT, async () => {
  console.log(
    `Server is Running on port ${process.env.port} on ${process.env.DEV_MODE} mode`
  );
});
