import { User } from "../models/user.model.js" 
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    console.log("[JWT] verifyJWT called —", req.method, req.originalUrl, "| token present:", !!token)

    try {
        if (!token){
            throw new ApiError(401, "Unauthorized")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken" )
    
        if(!user){
            throw new ApiError(401, "User not found")
        }
    
        console.log("[JWT] TOKEN VERIFIED — user:", user?.email)
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export const requireEmployer = asyncHandler(async(req, res, next) => {
    if (req.user.role !== "employer") {
        throw new ApiError(403, "Access denied. Employer role required.")
    }
    next()
})

export const requireFreelancer = asyncHandler(async(req, res, next) => {
    if (req.user.role !== "freelancer") {
        throw new ApiError(403, "Access denied. Freelancer role required.")
    }
    next()
})

export const requireAdmin = asyncHandler(async(req, res, next) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.")
    }
    next()
})