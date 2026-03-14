import mongoose, { Schema } from "mongoose";
import { SubmissionStatus } from "../../constants.js"

const submissionSchema = new Schema(
    {
        milestone: {
            type: Schema.Types.ObjectId,
            ref: "Milestone",
            required: true,
            index: true
        },
        freelancer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        content: {
            type: String,
            required: true,
        },
        repoLink: {
            type: String,
        },
        attachments: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: Object.values(SubmissionStatus),
            default: SubmissionStatus.PENDING
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviewNotes: {
            type: String,
        },
        reviewedAt: {
            type: Date,
        },
        aiScore: {
            type: Number,
            min: 0,
            max: 100
        },
        aiFeedback: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

export const Submission = mongoose.model("Submission", submissionSchema)