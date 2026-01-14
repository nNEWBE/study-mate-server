import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const registerUser = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await AuthServices.regsiterUserIntoDB(name, email, password);
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
    const { accessToken, refreshToken } = await AuthServices.loginUserIntoDB(email, password);

    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: Number(config.cookies_max_age),
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Login successful',
        data: {
            token: {
                accessToken,
            }
        }
    });
})

const logoutUser = catchAsync(async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.node_env === "production",
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
    const { accessToken } = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: {
            token: {
                accessToken,
            }
        }
    });
});

export const AuthControllers = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken
};
