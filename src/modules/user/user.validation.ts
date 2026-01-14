import { z } from "zod";

const registerUserValidationSchema = z.object({
    body: z.object({
        name: z.string(),

        email: z.string().email(),

        password: z.string().min(4),
    })
})

const loginUserValidationSchema = z.object({
    body: registerUserValidationSchema.shape.body.pick({
        email: true,
        password: true
    })
});

const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
    })
})

const blockUserValidationSchema = z.object({
    body: z.object({
        isBlocked: z.boolean(),
    })
})

export const UserValidations = {
    registerUserValidationSchema,
    loginUserValidationSchema,
    updateUserValidationSchema,
    blockUserValidationSchema
}
