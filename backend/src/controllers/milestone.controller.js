import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Milestone } from "../models/milestone.model.js";
import { Project } from "../models/project.model.js";
import { MilestoneStatus } from "../../constants.js";

const createMilestone = asyncHandler(async (req, res) => {
    const { projectId, title, description, amount, deadline, order } = req.body

    if (!projectId || !title || !description || !amount) {
        throw new ApiError(400, "Project ID, title, description, and amount are required")
    }

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to create milestones for this project")
    }

    const milestone = await Milestone.create({
        project: projectId,
        title,
        description,
        amount,
        deadline,
        order: order || 0,
        status: MilestoneStatus.PENDING
    })

    const createdMilestone = await Milestone.findById(milestone._id)
        .populate('project')

    return res
        .status(201)
        .json(new ApiResponse(201, createdMilestone, "Milestone created successfully"))
})

const getProjectMilestones = asyncHandler(async (req, res) => {
    const { id } = req.params

    const project = await Project.findById(id)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const milestones = await Milestone.find({ project: id })
        .sort({ order: 1, createdAt: 1 })

    return res
        .status(200)
        .json(new ApiResponse(200, milestones, "Milestones fetched successfully"))
})

const updateMilestone = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, amount, deadline, order, status } = req.body

    const milestone = await Milestone.findById(id).populate('project')

    if (!milestone) {
        throw new ApiError(404, "Milestone not found")
    }

    if (milestone.project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this milestone")
    }

    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (amount) updateData.amount = amount
    if (deadline) updateData.deadline = deadline
    if (order !== undefined) updateData.order = order
    if (status) updateData.status = status

    const updatedMilestone = await Milestone.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    ).populate('project')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedMilestone, "Milestone updated successfully"))
})

const completeMilestone = asyncHandler(async (req, res) => {
    const { id } = req.params

    const milestone = await Milestone.findById(id).populate('project')

    if (!milestone) {
        throw new ApiError(404, "Milestone not found")
    }

    if (milestone.project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to complete this milestone")
    }

    milestone.status = MilestoneStatus.COMPLETED
    await milestone.save()

    return res
        .status(200)
        .json(new ApiResponse(200, milestone, "Milestone marked as completed"))
})

export default {
    createMilestone,
    getProjectMilestones,
    updateMilestone,
    completeMilestone
}