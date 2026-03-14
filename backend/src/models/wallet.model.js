import mongoose, { Schema } from "mongoose";

const walletSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true }
);

export const Wallet = mongoose.model("Wallet", walletSchema);
