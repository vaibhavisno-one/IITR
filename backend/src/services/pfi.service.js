import { PFI } from "../models/pfi.model.js"
import { Submission } from "../models/submission.model.js"
import { Project } from "../models/project.model.js"
import { SubmissionStatus, ProjectStatus } from "../../constants.js"

const calculatePFIScore = async (freelancerId) => {
    const submissions = await Submission.find({ freelancer: freelancerId })
    
    const totalSubmissions = submissions.length
    const approvedSubmissions = submissions.filter(s => s.status === SubmissionStatus.APPROVED).length
    const rejectedSubmissions = submissions.filter(s => s.status === SubmissionStatus.REJECTED).length
    const revisionRequests = submissions.filter(s => s.status === SubmissionStatus.REVISION_REQUESTED).length
    
    const projects = await Project.find({ freelancer: freelancerId })
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length
    
    let score = 50
    
    if (totalSubmissions > 0) {
        const approvalRate = (approvedSubmissions / totalSubmissions) * 100
        score = approvalRate * 0.6
        
        const rejectionPenalty = (rejectedSubmissions / totalSubmissions) * 20
        score -= rejectionPenalty
        
        const revisionPenalty = (revisionRequests / totalSubmissions) * 10
        score -= revisionPenalty
    }
    
    if (totalProjects > 0) {
        const completionRate = (completedProjects / totalProjects) * 100
        score += completionRate * 0.3
    }
    
    score = Math.max(0, Math.min(100, score))
    
    return {
        score: Math.round(score),
        totalProjects,
        completedProjects,
        approvedSubmissions,
        rejectedSubmissions,
        revisionRequests,
        averageRating: 0,
        onTimeDelivery: 0
    }
}

const updatePFI = async (freelancerId) => {
    const pfiData = await calculatePFIScore(freelancerId)
    
    const pfi = await PFI.findOneAndUpdate(
        { freelancer: freelancerId },
        { 
            ...pfiData,
            lastCalculated: new Date()
        },
        { upsert: true, new: true }
    )
    
    return pfi
}

const getPFI = async (freelancerId) => {
    let pfi = await PFI.findOne({ freelancer: freelancerId })
    
    if (!pfi) {
        pfi = await updatePFI(freelancerId)
    }
    
    return pfi
}

const getTopFreelancers = async (limit = 10) => {
    const rankings = await PFI.find()
        .sort({ score: -1 })
        .limit(limit)
        .populate('freelancer', 'username fullName email')
    
    return rankings
}

export default {
    calculatePFIScore,
    updatePFI,
    getPFI,
    getTopFreelancers
}