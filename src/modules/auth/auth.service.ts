import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model"
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { isUserExistsAndNotBlocked } from "../user/user.utils";

const regsiterUserIntoDB = async (name: string, email: string, password: string) => {
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
        password
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
        config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    return {
        accessToken,
        refreshToken
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
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

export const AuthServices = {
    regsiterUserIntoDB,
    loginUserIntoDB,
    refreshToken
}
