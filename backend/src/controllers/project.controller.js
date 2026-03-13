import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ProjectStatus } from "../../constants.js";

const createProject = asyncHandler(async (req, res) => {
    const { title, description, budget, deadline, skills } = req.body

    if (!title || !description || !budget) {
        throw new ApiError(400, "Title, description, and budget are required")
    }

    const project = await Project.create({
        title,
        description,
        budget,
        deadline,
        skills: skills || [],
        employer: req.user._id,
        status: ProjectStatus.OPEN
    })

    const createdProject = await Project.findById(project._id)
        .populate('employer', 'username fullName email')

    return res
        .status(201)
        .json(new ApiResponse(201, createdProject, "Project created successfully"))
})

const getProjects = asyncHandler(async (req, res) => {
    const { status, skills } = req.query

    const query = {}
    
    if (status) {
        query.status = status
    }

    if (skills) {
        query.skills = { $in: skills.split(',') }
    }

    const projects = await Project.find(query)
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"))
})

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const project = await Project.findById(id)
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully"))
})

const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, budget, deadline, skills, status } = req.body

    const project = await Project.findById(id)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this project")
    }

    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (budget) updateData.budget = budget
    if (deadline) updateData.deadline = deadline
    if (skills) updateData.skills = skills
    if (status) updateData.status = status

    const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    ).populate('employer', 'username fullName email')
     .populate('freelancer', 'username fullName email')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"))
})

const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params

    const project = await Project.findById(id)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this project")
    }

    await Project.findByIdAndDelete(id)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project deleted successfully"))
})

const assignFreelancer = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { freelancerId } = req.body

    if (!freelancerId) {
        throw new ApiError(400, "Freelancer ID is required")
    }

    const project = await Project.findById(id)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to assign freelancers to this project")
    }

    const freelancer = await User.findById(freelancerId)

    if (!freelancer || freelancer.role !== "freelancer") {
        throw new ApiError(404, "Freelancer not found")
    }

    project.freelancer = freelancerId
    project.status = ProjectStatus.IN_PROGRESS
    await project.save()

    const updatedProject = await Project.findById(id)
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Freelancer assigned successfully"))
})

export default {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    assignFreelancer
}