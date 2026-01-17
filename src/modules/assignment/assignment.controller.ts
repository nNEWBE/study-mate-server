import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AssignmentServices } from "./assignment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IImageFile } from "../../interface/ImageFile";

const createAssignment = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as IImageFile[] | undefined;
    const user = req.user;
    const result = await AssignmentServices.createAssignment(req.body, files, user);
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
    const files = req.files as IImageFile[] | undefined;
    const result = await AssignmentServices.updateAssignment(id, req.body, files);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignment updated successfully',
        data: result,
    });
});

// Toggle best assignment status (Admin only)
const toggleBestAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isBest } = req.body;

    if (!id) throw new Error("ID is required");
    if (typeof isBest !== 'boolean') throw new Error("isBest must be a boolean");

    const result = await AssignmentServices.toggleBestAssignment(id, isBest);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Assignment ${isBest ? 'marked as best' : 'removed from best'}`,
        data: result,
    });
});

// Get best assignments only
const getBestAssignments = catchAsync(async (req: Request, res: Response) => {
    const result = await AssignmentServices.getBestAssignments();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Best assignments retrieved successfully',
        data: result,
    });
});

const addReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const user = req.user;

    if (!id) throw new Error("ID is required");

    const result = await AssignmentServices.addReview(id, user, rating, feedback);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review added successfully',
        data: result,
    });
});


export const AssignmentControllers = {
    createAssignment,
    getAllAssignments,
    getSingleAssignment,
    deleteAssignment,
    updateAssignment,
    toggleBestAssignment,
    getBestAssignments,
    addReview,
};
