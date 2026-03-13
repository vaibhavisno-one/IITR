import mongoose, { Schema } from "mongoose";
import { ProjectStatus } from "../../constants.js"

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true,
        },
        employer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        freelancer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        budget: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: Object.values(ProjectStatus),
            default: ProjectStatus.OPEN
        },
        deadline: {
            type: Date,
        },
        skills: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
)

export const Project = mongoose.model("Project", projectSchema)