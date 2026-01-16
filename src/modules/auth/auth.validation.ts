import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().optional(), // Optional for social login
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string(),
    }),
});

export const AuthValidation = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
