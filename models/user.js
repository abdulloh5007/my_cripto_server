import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    uzsCoins: Number,

    energyLevel: Number,
    energyHave: Number,

    tapLevel: Number,
    tapHave: Number,

    boostTap: Number,
    boostEnergy: Number,
},
    {
        timestamps: true,
    })

export default mongoose.model('User', UserSchema)