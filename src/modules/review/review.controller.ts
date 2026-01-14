import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
    const { user } = req;
    const body = {
        ...req.body,
        user: user._id,
    };
    const result = await ReviewServices.createReview(body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});

const getAllReviews = catchAsync(async (req, res) => {
    const result = await ReviewServices.getAllReviews(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
    });
});

export const ReviewControllers = {
    createReview,
    getAllReviews,
};
