import { z } from 'zod';

const createRoleRequestValidationSchema = z.object({
    body: z.object({
        requestedRole: z.enum(['teacher', 'admin']),
        reason: z.string().min(10),
    }),
});

const updateRoleRequestValidationSchema = z.object({
    body: z.object({
        status: z.enum(['approved', 'rejected']),
        adminNote: z.string().optional(),
    }),
});

export const RoleRequestValidations = {
    createRoleRequestValidationSchema,
    updateRoleRequestValidationSchema,
};
