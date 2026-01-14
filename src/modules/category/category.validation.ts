import { z } from 'zod';

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        imageUrl: z.string().url(),
        color: z.string(),
    }),
});

const updateCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        imageUrl: z.string().url().optional(),
        color: z.string().optional(),
    }),
});

export const CategoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
