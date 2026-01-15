import { Schema, Types, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, UserModel>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        immutable: true,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "student", "teacher"],
        default: "student",
    },
    phone: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    profileImage: { type: String, default: "N/A" },
    provider: {
        type: String,
        enum: ["google", "github", "email"],
        default: "email",
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds),
    );
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email }).select('+password');
};

userSchema.statics.isUserExistsById = async function (id: Types.ObjectId | string) {
    return await User.findById(id).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
