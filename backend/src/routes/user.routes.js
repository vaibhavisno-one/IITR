import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.get("/profile", userController.getProfile)
router.put("/profile", userController.updateProfile)
router.get("/projects", userController.getUserProjects)
router.get("/pfi", userController.getUserPFI)

export default router