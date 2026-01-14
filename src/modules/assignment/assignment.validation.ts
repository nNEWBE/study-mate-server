import { z } from 'zod';

const createAssignmentValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        description: z.string(),
        marks: z.number(),
        content: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        dueDate: z.string().transform((str) => new Date(str)),
        createdBy: z.object({
            name: z.string(),
            email: z.string().email(),
            role: z.string(),
            profileImage: z.string().optional(),
        }),
        categoryId: z.string(),
    }),
});

const updateAssignmentValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        marks: z.number().optional(),
        content: z.string().optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        dueDate: z.string().transform((str) => new Date(str)).optional(),
    }),
});

export const AssignmentValidations = {
    createAssignmentValidationSchema,
    updateAssignmentValidationSchema,
};
