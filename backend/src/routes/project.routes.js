import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import { verifyJWT, requireEmployer } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/", requireEmployer, projectController.createProject)
router.get("/", projectController.getProjects)
router.get("/:id", projectController.getProjectById)
router.put("/:id", requireEmployer, projectController.updateProject)
router.delete("/:id", requireEmployer, projectController.deleteProject)
router.post("/:id/assign", requireEmployer, projectController.assignFreelancer)

router.post("/:id/apply", projectController.applyForProject)
router.get("/:id/applicants", requireEmployer, projectController.getProjectApplicants)

export default router