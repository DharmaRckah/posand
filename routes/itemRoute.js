import express from "express"
import { createItem, deleteItem, getAllItems, updateItem } from "../controllers/itemController.js"
const routes = express.Router()

routes.get("/", getAllItems)
routes.post("/", createItem)
routes.delete("/:_id", deleteItem)
routes.put("/:_id", updateItem)

export default routes