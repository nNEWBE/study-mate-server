import { z } from "zod";

const registerUserValidationSchema = z.object({
    body: z.object({
        name: z.string(),

        email: z.string().email(),

        // Password is optional for social login (google/github)
        password: z.string().optional(),
        profileImageUrl: z.string().optional(),
        provider: z.enum(["google", "github", "email", "password"]).optional(),
    }).refine((data) => {
        // If provider is 'password' or 'email' or not specified, password is required
        if (!data.provider || data.provider === 'password' || data.provider === 'email') {
            return data.password && data.password.length >= 4;
        }
        // For google/github, password is not required
        return true;
    }, {
        message: "Password must be at least 4 characters for email/password registration",
        path: ["password"],
    })
})

const loginUserValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().optional(), // Optional for social login
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
