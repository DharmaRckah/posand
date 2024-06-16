import express from "express"
import { createUnit, deleteUnit, getUint, updateUnit } from "../controllers/unitController.js"


const routes = express.Router()

routes.get("/", getUint)
routes.post("/", createUnit)
routes.delete("/:_id", deleteUnit)
routes.put("/:_id", updateUnit)

export default routes