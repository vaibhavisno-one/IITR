import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { Milestone } from "../models/milestone.model.js";
import aiService from "../services/ai.service.js";
import { ProjectStatus } from "../../constants.js";

const createProject = asyncHandler(async (req, res) => {
    const { title, description, budget, deadline, skills } = req.body

    if (!title || !description || !budget) {
        throw new ApiError(400, "Title, description, and budget are required")
    }

    // Attempt to lock funds in Escrow
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.walletBalance < budget) {
        throw new ApiError(400, "Insufficient wallet balance to create this project. Please deposit funds first.")
    }

    // Deduct from walletBalance, add to escrowLocked
    wallet.walletBalance -= Number(budget);
    wallet.escrowLocked += Number(budget);
    await wallet.save();

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

    // Automatically Generate Milestones using AI
    let createdMilestones = [];
    try {
        const aiMilestones = await aiService.generateMilestones({
            title: project.title,
            description: project.description,
            budget: project.budget,
            deadline: project.deadline
        });

        if (aiMilestones && aiMilestones.length > 0) {
            let currentDate = new Date();
            const milestonesToCreate = aiMilestones.map((m, index) => {
                const amount = Math.floor((m.percentageBudget / 100) * project.budget);
                currentDate = new Date(currentDate.getTime() + m.days * 24 * 60 * 60 * 1000);
                
                return {
                    project: project._id,
                    title: m.title,
                    description: m.description,
                    amount: amount,
                    deadline: new Date(currentDate),
                    order: index,
                    status: "pending"
                };
            });
            createdMilestones = await Milestone.insertMany(milestonesToCreate);
        }
    } catch (err) {
        console.error("AI Milestone generation failed during auto-creation:", err);
    }

    const responsePayload = {
        project: createdProject,
        milestones: createdMilestones
    }

    return res
        .status(201)
        .json(new ApiResponse(201, responsePayload, "Project created and milestones generated successfully"))
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

    // Refund escrow if the project hasn't been completed and funds are still locked
    if (project.status !== ProjectStatus.COMPLETED) {
        const wallet = await Wallet.findOne({ user: req.user._id });
        if (wallet) {
            wallet.escrowLocked -= project.budget;
            wallet.walletBalance += project.budget;
            await wallet.save();
        }
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
    project.status = ProjectStatus.ASSIGNED
    
    // Mark the accepted application, reject the rest
    if (project.applicants && project.applicants.length > 0) {
        project.applicants.forEach(app => {
            if (app.freelancer.toString() === freelancerId) {
                app.status = "accepted";
            } else {
                app.status = "rejected";
            }
        });
    }
    
    await project.save()

    const updatedProject = await Project.findById(id)
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Freelancer assigned successfully"))
})

const applyForProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (req.user.role !== "freelancer") {
        throw new ApiError(403, "Only freelancers can apply for projects");
    }

    const project = await Project.findById(id);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.status !== ProjectStatus.OPEN) {
        throw new ApiError(400, "Project is no longer open for applications");
    }

    const alreadyApplied = project.applicants?.some(
        app => app.freelancer.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
        throw new ApiError(400, "You have already applied for this project");
    }

    if (!project.applicants) {
        project.applicants = [];
    }

    project.applicants.push({
        freelancer: req.user._id,
        message: message || ""
    });

    await project.save();

    return res.status(200).json(new ApiResponse(200, {}, "Application submitted successfully"));
});

const getProjectApplicants = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id).populate({
        path: 'applicants.freelancer',
        select: 'username fullName email skills bio'
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the employer can view applicants");
    }

    return res.status(200).json(new ApiResponse(200, project.applicants || [], "Applicants fetched successfully"));
});

const generateMilestones = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.employer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the employer can generate milestones");
    }

    const existingMilestones = await Milestone.find({ project: id });
    if (existingMilestones.length > 0) {
        throw new ApiError(400, "Milestones already generated for this project");
    }

    const aiMilestones = await aiService.generateMilestones({
        title: project.title,
        description: project.description,
        budget: project.budget,
        deadline: project.deadline
    });

    if (!aiMilestones || aiMilestones.length === 0) {
        throw new ApiError(500, "Failed to generate milestones via AI");
    }

    let currentDate = new Date();
    const milestonesToCreate = aiMilestones.map((m, index) => {
        const amount = Math.floor((m.percentageBudget / 100) * project.budget);
        currentDate = new Date(currentDate.getTime() + m.days * 24 * 60 * 60 * 1000);
        
        return {
            project: project._id,
            title: m.title,
            description: m.description,
            amount: amount,
            deadline: new Date(currentDate),
            order: index,
            status: "pending"
        };
    });

    const createdMilestones = await Milestone.insertMany(milestonesToCreate);

    return res.status(201).json(new ApiResponse(201, createdMilestones, "Milestones generated successfully"));
});

export default {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    assignFreelancer,
    applyForProject,
    getProjectApplicants,
    generateMilestones
}