import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RoleRequestServices } from "./roleRequest.service";

const createRoleRequest = catchAsync(async (req, res) => {
    const { user } = req;
    const result = await RoleRequestServices.createRoleRequest(user._id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Role request submitted successfully',
        data: result,
    });
});

const getMyRoleRequests = catchAsync(async (req, res) => {
    const { user } = req;
    const result = await RoleRequestServices.getMyRoleRequests(user._id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My role requests retrieved successfully',
        data: result,
    });
});

const getAllRoleRequests = catchAsync(async (req, res) => {
    const { status } = req.query;
    const result = await RoleRequestServices.getAllRoleRequests(status as string | undefined);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All role requests retrieved successfully',
        data: result,
    });
});

const updateRoleRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RoleRequestServices.updateRoleRequest(id as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Role request ${req.body.status} successfully`,
        data: result,
    });
});

export const RoleRequestControllers = {
    createRoleRequest,
    getMyRoleRequests,
    getAllRoleRequests,
    updateRoleRequest,
};
