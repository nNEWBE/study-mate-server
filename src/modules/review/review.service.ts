import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReview = async (payload: TReview) => {
    const result = await Review.create(payload);
    return result;
};

const getAllReviews = async () => {
    const result = await Review.find().populate('user', 'name email profileImage');
    return result;
};

export const ReviewServices = {
    createReview,
    getAllReviews,
};
