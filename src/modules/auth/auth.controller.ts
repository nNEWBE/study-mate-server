import { Request, Response } from "express";
import config from "../../config";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
    const user = req.body;
    const token = jwt.sign(user, config.jwt_access_secret as string, { expiresIn: '1h' });

    res
        .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .status(httpStatus.OK)
        .json({
            success: true,
            message: 'Login successful',
            token
        });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 0,
        })
        .status(httpStatus.OK)
        .json({
            success: true,
            message: 'Logout successful'
        });
});

export const AuthControllers = {
    login,
    logout
};
