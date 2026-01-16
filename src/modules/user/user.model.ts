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
        trim: true,
    },
    password: {
        type: String,
        required: false, // Optional for social login users
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
    providers: {
        type: [String],
        enum: ["google", "github", "password"],
        default: ["password"],
    },
}, {
    timestamps: true,
});

// Only hash password if it exists and is modified
userSchema.pre('save', async function () {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(
            this.password,
            Number(config.bcrypt_salt_rounds),
        );
    }
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
