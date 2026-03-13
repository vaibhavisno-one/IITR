import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import pfiService from "../services/pfi.service.js";

const getPFIByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.role !== "freelancer") {
        throw new ApiError(400, "PFI is only available for freelancers")
    }

    const pfi = await pfiService.getPFI(userId)

    return res
        .status(200)
        .json(new ApiResponse(200, pfi, "PFI score fetched successfully"))
})

const recalculatePFI = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.role !== "freelancer") {
        throw new ApiError(400, "PFI is only available for freelancers")
    }

    const pfi = await pfiService.updatePFI(userId)

    return res
        .status(200)
        .json(new ApiResponse(200, pfi, "PFI recalculated successfully"))
})

const getRanking = asyncHandler(async (req, res) => {
    const { limit } = req.query

    const rankings = await pfiService.getTopFreelancers(parseInt(limit) || 10)

    return res
        .status(200)
        .json(new ApiResponse(200, rankings, "Rankings fetched successfully"))
})

export default {
    getPFIByUserId,
    recalculatePFI,
    getRanking
}