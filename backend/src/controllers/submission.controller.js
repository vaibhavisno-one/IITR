import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Submission } from "../models/submission.model.js";
import { Milestone } from "../models/milestone.model.js";
import { Project } from "../models/project.model.js";
import { SubmissionStatus } from "../../constants.js";
import aiService from "../services/ai.service.js";
import pfiService from "../services/pfi.service.js";

const createSubmission = asyncHandler(async (req, res) => {
    const { milestoneId, content, attachments } = req.body

    if (!milestoneId || !content) {
        throw new ApiError(400, "Milestone ID and content are required")
    }

    const milestone = await Milestone.findById(milestoneId).populate('project')

    if (!milestone) {
        throw new ApiError(404, "Milestone not found")
    }

    if (milestone.project.freelancer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to submit work for this milestone")
    }

    const aiEvaluation = await aiService.evaluateSubmission(content)

    const submission = await Submission.create({
        milestone: milestoneId,
        freelancer: req.user._id,
        content,
        attachments: attachments || [],
        status: SubmissionStatus.PENDING,
        aiScore: aiEvaluation.score,
        aiFeedback: aiEvaluation.feedback
    })

    const createdSubmission = await Submission.findById(submission._id)
        .populate('milestone')
        .populate('freelancer', 'username fullName email')

    return res
        .status(201)
        .json(new ApiResponse(201, createdSubmission, "Submission created successfully"))
})

const getSubmissionById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const submission = await Submission.findById(id)
        .populate('milestone')
        .populate('freelancer', 'username fullName email')
        .populate('reviewedBy', 'username fullName email')

    if (!submission) {
        throw new ApiError(404, "Submission not found")
    }

    const milestone = await Milestone.findById(submission.milestone).populate('project')

    const isEmployer = milestone.project.employer.toString() === req.user._id.toString()
    const isFreelancer = submission.freelancer._id.toString() === req.user._id.toString()

    if (!isEmployer && !isFreelancer) {
        throw new ApiError(403, "You are not authorized to view this submission")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, submission, "Submission fetched successfully"))
})

const getMilestoneSubmissions = asyncHandler(async (req, res) => {
    const { id } = req.params

    const milestone = await Milestone.findById(id).populate('project')

    if (!milestone) {
        throw new ApiError(404, "Milestone not found")
    }

    const isEmployer = milestone.project.employer.toString() === req.user._id.toString()
    const isFreelancer = milestone.project.freelancer && milestone.project.freelancer.toString() === req.user._id.toString()

    if (!isEmployer && !isFreelancer) {
        throw new ApiError(403, "You are not authorized to view submissions for this milestone")
    }

    const submissions = await Submission.find({ milestone: id })
        .populate('freelancer', 'username fullName email')
        .populate('reviewedBy', 'username fullName email')
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, submissions, "Submissions fetched successfully"))
})

const reviewSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status, reviewNotes } = req.body

    if (!status) {
        throw new ApiError(400, "Status is required")
    }

    if (![SubmissionStatus.APPROVED, SubmissionStatus.REJECTED, SubmissionStatus.REVISION_REQUESTED].includes(status)) {
        throw new ApiError(400, "Invalid status")
    }

    const submission = await Submission.findById(id).populate({
        path: 'milestone',
        populate: { path: 'project' }
    })

    if (!submission) {
        throw new ApiError(404, "Submission not found")
    }

    const milestone = submission.milestone
    const project = milestone.project

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to review this submission")
    }

    submission.status = status
    submission.reviewNotes = reviewNotes
    submission.reviewedBy = req.user._id
    submission.reviewedAt = new Date()
    await submission.save()

    await pfiService.updatePFI(submission.freelancer)

    const updatedSubmission = await Submission.findById(id)
        .populate('milestone')
        .populate('freelancer', 'username fullName email')
        .populate('reviewedBy', 'username fullName email')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedSubmission, "Submission reviewed successfully"))
})

export default {
    createSubmission,
    getSubmissionById,
    getMilestoneSubmissions,
    reviewSubmission
}