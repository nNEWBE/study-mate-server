import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubmissionServices } from "./submission.service";

const createSubmission = catchAsync(async (req, res) => {
    const { user } = req;
    const body = {
        ...req.body,
        studentId: user._id,
        studentName: user.name, // Assuming name is on token, otherwise fetch from DB
        studentEmail: user.email,
    };

    const result = await SubmissionServices.createSubmission(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Assignment submitted successfully',
        data: result,
    });
});

const getAllSubmissions = catchAsync(async (req, res) => {
    const result = await SubmissionServices.getAllSubmissions(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Submissions retrieved successfully',
        data: result,
    });
});

const getMySubmissions = catchAsync(async (req, res) => {
    const { email } = req.user;
    const result = await SubmissionServices.getMySubmissions(email);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My submissions retrieved successfully',
        data: result,
    });
});

const getSingleSubmission = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SubmissionServices.getSingleSubmission(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Submission retrieved successfully',
        data: result,
    });
});

const updateSubmission = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SubmissionServices.updateSubmission(id as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Submission updated successfully',
        data: result,
    });
});

export const SubmissionControllers = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
    getSingleSubmission,
    updateSubmission,
};
