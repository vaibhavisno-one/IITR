import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import pfiService from "../services/pfi.service.js";

const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"))
})

const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, bio, skills } = req.body

    const updateData = {}
    if (fullName) updateData.fullName = fullName
    if (bio !== undefined) updateData.bio = bio
    if (skills) updateData.skills = skills

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile updated successfully"))
})

const getUserProjects = asyncHandler(async (req, res) => {
    const query = req.user.role === "employer" 
        ? { employer: req.user._id }
        : { freelancer: req.user._id }

    const projects = await Project.find(query)
        .populate('employer', 'username fullName email')
        .populate('freelancer', 'username fullName email')
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"))
})

const getUserPFI = asyncHandler(async (req, res) => {
    if (req.user.role !== "freelancer") {
        throw new ApiError(400, "PFI is only available for freelancers")
    }

    const pfi = await pfiService.getPFI(req.user._id)

    return res
        .status(200)
        .json(new ApiResponse(200, pfi, "PFI score fetched successfully"))
})

export default {
    getProfile,
    updateProfile,
    getUserProjects,
    getUserPFI
}