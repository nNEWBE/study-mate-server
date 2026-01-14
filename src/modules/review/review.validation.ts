import { z } from 'zod';

const createReviewValidationSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string(),
    }),
});

export const ReviewValidations = {
    createReviewValidationSchema,
};
