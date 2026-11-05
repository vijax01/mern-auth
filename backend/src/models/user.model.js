import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 255,
        },
        password: {
            type: String,
            maxlength: 255,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Unique index handle karega jab googleId null/absent ho
        },
        imageUrl: {
            type: String,
            default: null,
        },
        authProvider: {
            type: String,
            required: true,
            default: 'email',
            enum: ['email', 'google'],
        },
        isAccountVerified: {
            type: Boolean,
            default: false,
        },
        verifyOtp: {
            type: String,
            default: null,
        },
        verifyOtpExpireAt: {
            type: Date,
            default: null,
        },
        resetOtp: {
            type: String,
            default: null,
        },
        resetOtpExpireAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false }, // PostgreSQL ke created_at ko handle karne ke liye
    }
);

const User = mongoose.model('User', userSchema);

export default User;