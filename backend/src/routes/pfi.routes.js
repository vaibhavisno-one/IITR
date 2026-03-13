import { Router } from "express";
import pfiController from "../controllers/pfi.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.get("/ranking", pfiController.getRanking)
router.get("/:userId", pfiController.getPFIByUserId)
router.post("/:userId/recalculate", pfiController.recalculatePFI)

export default router