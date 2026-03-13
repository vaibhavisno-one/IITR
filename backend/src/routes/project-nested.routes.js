import { Router } from "express";
import milestoneController from "../controllers/milestone.controller.js";
import submissionController from "../controllers/submission.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.get("/:id/milestones", milestoneController.getProjectMilestones)
router.get("/milestones/:id/submissions", submissionController.getMilestoneSubmissions)

export default router
