import { Router } from "express";
import milestoneController from "../controllers/milestone.controller.js";
import { verifyJWT, requireEmployer } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/", requireEmployer, milestoneController.createMilestone)
router.put("/:id", requireEmployer, milestoneController.updateMilestone)
router.patch("/:id/complete", requireEmployer, milestoneController.completeMilestone)

export default router