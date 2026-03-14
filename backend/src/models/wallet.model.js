import mongoose, { Schema } from "mongoose";

const walletSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        walletBalance: {
            type: Number,
            default: 0,
            min: 0
        },
        escrowLocked: {
            type: Number,
            default: 0,
            min: 0
        },
        payoutBalance: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true }
);

export const Wallet = mongoose.model("Wallet", walletSchema);
