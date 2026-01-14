import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { IImageFile } from "../../interface/ImageFile";

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB(req.query);
    sendResponse(res, {
        success: true,
        message: 'Users fetched successfully',
        statusCode: httpStatus.OK,
        data: result
    });
});

const updateUser = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const body = req.body;
    const result = await UserServices.updateUserFromDB(id, body, req.file as IImageFile);
    sendResponse(res, {
        success: true,
        message: 'User updated successfully',
        statusCode: httpStatus.OK,
        data: result
    });
})

const blockUser = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const { isBlocked } = req.body;
    const result = await UserServices.blockUserFromDB(id, isBlocked);
    sendResponse(res, {
        success: true,
        message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
        statusCode: httpStatus.OK,
        data: result
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const result = await UserServices.getMe(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is retrieved succesfully',
        data: result,
    });
});

export const UserController = {
    getAllUsers,
    updateUser,
    blockUser,
    getMe
};
