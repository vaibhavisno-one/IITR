import { Router } from "express";
import submissionController from "../controllers/submission.controller.js";
import { verifyJWT, requireFreelancer, requireEmployer } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/", requireFreelancer, submissionController.createSubmission)
router.get("/:id", submissionController.getSubmissionById)
router.put("/:id/review", requireEmployer, submissionController.reviewSubmission)

export default router