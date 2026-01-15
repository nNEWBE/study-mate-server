import httpStatus from "http-status";
import { SignOptions } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model"
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { isUserExistsAndNotBlocked } from "../user/user.utils";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { IImageFile } from "../../interface/ImageFile";

const regsiterUserIntoDB = async (name: string, email: string, password: string, profileImageUrl?: string, provider?: string, socialId?: string) => {
    const isEmailExist = await User.isUserExistsByEmail(email);
    if (isEmailExist) {
        throw new AppError('email',
            httpStatus.BAD_REQUEST,
            `${email} already exists!`,
        );
    }

    const result = User.create({
        name,
        email,
        password,
        profileImage: profileImageUrl || "N/A",
        provider: provider || "email",
        socialId: socialId || null
    })

    return result;
}

const loginUserIntoDB = async (email: string, password: string) => {
    const user = await User.isUserExistsByEmail(email);

    isUserExistsAndNotBlocked(user);

    const isPasswordMatched = await User.isPasswordMatched(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError("password", httpStatus.UNAUTHORIZED, 'Password does not match !!');
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

const socialLoginIntoDB = async (payload: { email?: string, socialId?: string }) => {
    let user = null;

    if (payload.email) {
        user = await User.isUserExistsByEmail(payload.email);
    }

    if (!user && payload.socialId) {
        user = await User.findOne({ socialId: payload.socialId });
    }

    if (!user) {
        throw new AppError("email", httpStatus.NOT_FOUND, 'User not found!');
    }

    isUserExistsAndNotBlocked(user);

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

export const AuthServices = {
    regsiterUserIntoDB,
    loginUserIntoDB,
    refreshToken,
    socialLoginIntoDB
}
