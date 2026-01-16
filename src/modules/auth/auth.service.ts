import httpStatus from "http-status";
import { SignOptions } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model"
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { isUserExistsAndNotBlocked } from "../user/user.utils";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { IImageFile } from "../../interface/ImageFile";
import bcrypt from 'bcrypt';

const regsiterUserIntoDB = async (name: string, email: string, password: string, profileImageUrl?: string, provider?: string) => {
    const existingUser = await User.isUserExistsByEmail(email);

    // Convert provider to new format (use 'password' instead of 'email')
    const newProvider = provider === 'email' ? 'password' : (provider || 'password');

    if (existingUser) {
        // If user exists, check if they're trying to add a new provider
        const currentProviders = existingUser.providers || [];

        // If user already has 'password' provider and trying to register with password again - error
        if (newProvider === 'password' && currentProviders.includes('password')) {
            throw new AppError('email',
                httpStatus.BAD_REQUEST,
                `${email} already exists with password login!`,
            );
        }

        // If this provider already exists for this user - error
        if (currentProviders.includes(newProvider as "google" | "github" | "password")) {
            throw new AppError('email',
                httpStatus.BAD_REQUEST,
                `${email} already exists with ${newProvider} login!`,
            );
        }

        // Add new provider to existing user
        const updatedProviders = [...currentProviders, newProvider];
        const updateData: any = { providers: updatedProviders };

        // If this is password registration, also update password
        if (newProvider === 'password' && password) {
            const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
            updateData.password = hashedPassword;
        }



        // Update profile image if not already set
        if (profileImageUrl && existingUser.profileImage === "N/A") {
            updateData.profileImage = profileImageUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            existingUser._id,
            updateData,
            { new: true }
        );

        return updatedUser;
    }

    // New user - create with the provider
    const createData: any = {
        name,
        email,
        profileImage: profileImageUrl || "N/A",
        providers: [newProvider as "google" | "github" | "password"]
    };

    // Only add password if provider is 'password'
    if (newProvider === 'password' && password) {
        createData.password = password;
    }

    const result = User.create(createData);

    return result;
}

const loginUserIntoDB = async (email: string, password?: string) => {
    const user = await User.isUserExistsByEmail(email);

    isUserExistsAndNotBlocked(user);

    // If password is provided, validate it (email/password login)
    if (password) {
        // Check if user has password provider
        if (!user.providers?.includes('password')) {
            throw new AppError("password", httpStatus.BAD_REQUEST, 'This account was created with social login. Please use Google or GitHub to login.');
        }

        if (!user.password) {
            throw new AppError("password", httpStatus.BAD_REQUEST, 'No password set for this account. Please use social login.');
        }

        const isPasswordMatched = await User.isPasswordMatched(password, user.password);
        if (!isPasswordMatched) {
            throw new AppError("password", httpStatus.UNAUTHORIZED, 'Password does not match !!');
        }
    }

    const jwtPayload = {
        userName: user.name,
        userId: user.email,
        role: user.role,
        profileImage: user.profileImage
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as SignOptions["expiresIn"],
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as SignOptions["expiresIn"],
    );

    return {
        accessToken,
        refreshToken,
        user
    }

}

const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { userId } = decoded;
    const user = await User.isUserExistsByEmail(userId);

    isUserExistsAndNotBlocked(user);

    const jwtPayload = {
        userName: user.name,
        userId: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as SignOptions["expiresIn"],
    );

    return {
        accessToken,
        user,
    };
};

export const AuthServices = {
    regsiterUserIntoDB,
    loginUserIntoDB,
    refreshToken
}
