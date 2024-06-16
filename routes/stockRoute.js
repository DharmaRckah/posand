import express from "express"
import { createStock, deleteStock, getAllStocks, updateStock } from "../controllers/stockController.js"

const routes = express.Router()

routes.get("/", getAllStocks)
routes.post("/", createStock)
routes.delete("/:_id", deleteStock)
routes.put("/:_id", updateStock)

export default routes