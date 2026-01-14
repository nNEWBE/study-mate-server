import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AssignmentServices } from "./assignment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createAssignment = catchAsync(async (req: Request, res: Response) => {
    const result = await AssignmentServices.createAssignment(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignment created successfully',
        data: result,
    });
});

const getAllAssignments = catchAsync(async (req: Request, res: Response) => {
    const result = await AssignmentServices.getAllAssignments(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignments retrieved successfully',
        data: result,
    });
});

const getSingleAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error("ID is required");
    const result = await AssignmentServices.getSingleAssignment(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignment retrieved successfully',
        data: result,
    });
});

const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error("ID is required");
    const result = await AssignmentServices.deleteAssignment(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignment deleted successfully',
        data: result,
    });
});

const updateAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error("ID is required");
    const result = await AssignmentServices.updateAssignment(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignment updated successfully',
        data: result,
    });
});

export const AssignmentControllers = {
    createAssignment,
    getAllAssignments,
    getSingleAssignment,
    deleteAssignment,
    updateAssignment,
};
