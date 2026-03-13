import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Payment } from "../models/payment.model.js";
import { Milestone } from "../models/milestone.model.js";
import { PaymentStatus } from "../../constants.js";

const createEscrow = asyncHandler(async (req, res) => {
    const { milestoneId } = req.body

    if (!milestoneId) {
        throw new ApiError(400, "Milestone ID is required")
    }

    const milestone = await Milestone.findById(milestoneId).populate('project')

    if (!milestone) {
        throw new ApiError(404, "Milestone not found")
    }

    if (milestone.project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to create escrow for this milestone")
    }

    if (!milestone.project.freelancer) {
        throw new ApiError(400, "Project must have an assigned freelancer")
    }

    const existingPayment = await Payment.findOne({ milestone: milestoneId })

    if (existingPayment) {
        throw new ApiError(400, "Escrow already exists for this milestone")
    }

    const payment = await Payment.create({
        milestone: milestoneId,
        employer: milestone.project.employer,
        freelancer: milestone.project.freelancer,
        amount: milestone.amount,
        status: PaymentStatus.ESCROW,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })

    const createdPayment = await Payment.findById(payment._id)
        .populate('milestone')
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')

    return res
        .status(201)
        .json(new ApiResponse(201, createdPayment, "Escrow created successfully"))
})

const releasePayment = asyncHandler(async (req, res) => {
    const { milestoneId } = req.params

    const payment = await Payment.findOne({ milestone: milestoneId })
        .populate({
            path: 'milestone',
            populate: { path: 'project' }
        })

    if (!payment) {
        throw new ApiError(404, "Payment not found for this milestone")
    }

    const project = payment.milestone.project

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to release this payment")
    }

    if (payment.status !== PaymentStatus.ESCROW) {
        throw new ApiError(400, "Payment can only be released from escrow status")
    }

    payment.status = PaymentStatus.RELEASED
    payment.releasedAt = new Date()
    await payment.save()

    const updatedPayment = await Payment.findById(payment._id)
        .populate('milestone')
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPayment, "Payment released successfully"))
})

const refundPayment = asyncHandler(async (req, res) => {
    const { milestoneId } = req.params

    const payment = await Payment.findOne({ milestone: milestoneId })
        .populate({
            path: 'milestone',
            populate: { path: 'project' }
        })

    if (!payment) {
        throw new ApiError(404, "Payment not found for this milestone")
    }

    const project = payment.milestone.project

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to refund this payment")
    }

    if (payment.status !== PaymentStatus.ESCROW) {
        throw new ApiError(400, "Payment can only be refunded from escrow status")
    }

    payment.status = PaymentStatus.REFUNDED
    payment.refundedAt = new Date()
    await payment.save()

    const updatedPayment = await Payment.findById(payment._id)
        .populate('milestone')
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPayment, "Payment refunded successfully"))
})

const getPaymentHistory = asyncHandler(async (req, res) => {
    const query = {
        $or: [
            { employer: req.user._id },
            { freelancer: req.user._id }
        ]
    }

    const payments = await Payment.find(query)
        .populate('milestone')
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, payments, "Payment history fetched successfully"))
})

export default {
    createEscrow,
    releasePayment,
    refundPayment,
    getPaymentHistory
}