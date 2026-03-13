import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import { verifyJWT, requireEmployer } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/escrow", requireEmployer, paymentController.createEscrow)
router.post("/release/:milestoneId", requireEmployer, paymentController.releasePayment)
router.post("/refund/:milestoneId", requireEmployer, paymentController.refundPayment)
router.get("/history", paymentController.getPaymentHistory)

export default router