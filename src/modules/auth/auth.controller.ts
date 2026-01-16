import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const registerUser = catchAsync(async (req, res) => {
    const { name, email, password, profileImageUrl, provider } = req.body;
    const result = await AuthServices.regsiterUserIntoDB(name, email, password, profileImageUrl, provider) as any;
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: {
            _id: result._id,
            name: result.name,
            email: result.email
        },
    });
});

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthServices.loginUserIntoDB(email, password);

    // Cross-origin cookies require secure:true and sameSite:'none'
    // This is required when frontend and backend are on different domains (both HTTPS)
    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: 'none' as const,
        maxAge: Number(config.cookies_max_age) || 365 * 24 * 60 * 60 * 1000,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.cookie('accessToken', accessToken, cookieOptions);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Login successful',
        data: {
            user,
            accessToken,
            refreshToken
        }
    });
})

const logoutUser = catchAsync(async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logout successful",
        data: null,
    });

});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const { accessToken, user } = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: {
            accessToken,
            user,
        }
    });
});

// Check if user exists with a specific provider
const checkUserExists = catchAsync(async (req, res) => {
    const { email, provider } = req.query;

    if (!email || typeof email !== 'string') {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'Email is required',
            data: null
        });
    }

    const result = await AuthServices.checkUserExists(email, provider as string || 'password');

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User check completed',
        data: result
    });
});

export const AuthControllers = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    checkUserExists
};
