import mongoose, { Schema } from "mongoose";
import { MilestoneStatus } from "../../constants.js"

const milestoneSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: Object.values(MilestoneStatus),
            default: MilestoneStatus.PENDING
        },
        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

export const Milestone = mongoose.model("Milestone", milestoneSchema)