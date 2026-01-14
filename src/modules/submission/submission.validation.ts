import { z } from 'zod';

const createSubmissionValidationSchema = z.object({
    body: z.object({
        assignmentId: z.string(),
        studentId: z.string().optional(), // Often inferred from token
        assignmentTitle: z.string(),
        studentName: z.string().optional(), // Often inferred from token
        studentEmail: z.string().optional().or(z.string().email()), // Often inferred from token
        submissionLink: z.string().url(),
        note: z.string().optional(),
    }),
});

const updateSubmissionValidationSchema = z.object({
    body: z.object({
        status: z.enum(['pending', 'graded']).optional(),
        marks: z.number().optional(),
        feedback: z.string().optional(),
        rating: z.number().optional(),
    }),
});

export const SubmissionValidations = {
    createSubmissionValidationSchema,
    updateSubmissionValidationSchema,
};
