import mongoose, { Schema } from "mongoose";

const pfiSchema = new Schema(
    {
        freelancer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        score: {
            type: Number,
            default: 50,
            min: 0,
            max: 100
        },
        totalProjects: {
            type: Number,
            default: 0
        },
        completedProjects: {
            type: Number,
            default: 0
        },
        approvedSubmissions: {
            type: Number,
            default: 0
        },
        rejectedSubmissions: {
            type: Number,
            default: 0
        },
        revisionRequests: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        onTimeDelivery: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        lastCalculated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

export const PFI = mongoose.model("PFI", pfiSchema)