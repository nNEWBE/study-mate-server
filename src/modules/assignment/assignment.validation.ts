import { z } from 'zod';

// Regex for time format HH:mm (24-hour format)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createAssignmentValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        description: z.string(),
        marks: z.number(),
        content: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        dueDate: z.string().transform((str) => new Date(str)),
        dueTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm (24-hour format)').optional().default('23:59'),
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
        dueTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm (24-hour format)').optional(),
    }),
});

const toggleBestAssignmentValidationSchema = z.object({
    body: z.object({
        isBest: z.boolean(),
    }),
});

const addReviewValidationSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string().min(1),
    }),
});

export const AssignmentValidations = {
    createAssignmentValidationSchema,
    updateAssignmentValidationSchema,
    toggleBestAssignmentValidationSchema,
    addReviewValidationSchema,
};
