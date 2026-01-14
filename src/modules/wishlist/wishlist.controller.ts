import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistServices } from "./wishlist.service";

const addToWishlist = catchAsync(async (req, res) => {
    const { user } = req;
    const body = {
        ...req.body,
        user: user._id,
    };
    const result = await WishlistServices.addToWishlist(body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Assignment added to wishlist successfully',
        data: result,
    });
});

const getMyWishlist = catchAsync(async (req, res) => {
    const { user } = req;
    const result = await WishlistServices.getMyWishlist(user._id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My wishlist retrieved successfully',
        data: result,
    });
});

const removeFromWishlist = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const result = await WishlistServices.removeFromWishlist(id as string, user._id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assignment removed from wishlist successfully',
        data: result,
    });
});

export const WishlistControllers = {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
};
