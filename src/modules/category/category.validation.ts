import { z } from 'zod';

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        color: z.string(),
    }),
});

const updateCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        color: z.string().optional(),
    }),
});

export const CategoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
