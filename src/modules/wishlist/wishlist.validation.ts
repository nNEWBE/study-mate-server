import { z } from 'zod';

const addToWishlistValidationSchema = z.object({
    body: z.object({
        assignment: z.string(),
    }),
});

export const WishlistValidations = {
    addToWishlistValidationSchema,
};
