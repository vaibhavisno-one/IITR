import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import { verifyJWT, requireEmployer } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/escrow", requireEmployer, paymentController.createEscrow)
router.post("/release/:milestoneId", requireEmployer, paymentController.releasePayment)
router.post("/refund/:milestoneId", requireEmployer, paymentController.refundPayment)
router.get("/history", paymentController.getPaymentHistory)

router.get("/wallet", paymentController.getWalletBalance)
router.post("/deposit", requireEmployer, paymentController.depositFunds)
router.get("/escrow/summary", requireEmployer, paymentController.getEscrowSummary)

export default router