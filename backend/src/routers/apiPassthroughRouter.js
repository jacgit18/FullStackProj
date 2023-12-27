import { Router } from "express"
import { apiPassthroughController } from "../controllers/index.js"

const router = Router()

router.all("/:company_id/*", apiPassthroughController.sendToApi)

export default router
