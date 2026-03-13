import mongoose, { Schema } from "mongoose";
import { PaymentStatus } from "../../constants.js"

const paymentSchema = new Schema(
    {
        milestone: {
            type: Schema.Types.ObjectId,
            ref: "Milestone",
            required: true,
            index: true
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
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.ESCROW
        },
        transactionId: {
            type: String,
        },
        releasedAt: {
            type: Date,
        },
        refundedAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

export const Payment = mongoose.model("Payment", paymentSchema)