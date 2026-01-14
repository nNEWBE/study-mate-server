import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReview = async (payload: TReview) => {
    const result = await Review.create(payload);
    return result;
};

import QueryBuilder from "../../builder/QueryBuilder";

const getAllReviews = async (query: Record<string, unknown>) => {
    const reviewQuery = new QueryBuilder(Review.find().populate('user', 'name email profileImage'), query)
        .search(['feedback']) // optional: search reviews by content
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await reviewQuery.modelQuery;
    return result;
};

export const ReviewServices = {
    createReview,
    getAllReviews,
};
