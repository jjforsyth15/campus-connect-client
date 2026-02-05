import { z } from "zod";

// CSUN email validator (matches backend)
const csunEmail = z
  .string()
  .email({ message: "Invalid email address" })
  .refine((email) => email.toLowerCase().endsWith("@my.csun.edu"), {
    message: "Only @my.csun.edu email addresses are allowed",
  });

// Strong password validator (matches backend)
const strongPassword = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password must not exceed 100 characters" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

// Login validation schema
export const loginSchema = z.object({
  email: csunEmail,
  password: z.string().min(1, { message: "Password is required" }), // Login doesn't need strong validation
});

// Register validation schema
export const registerSchema = z.object({
  email: csunEmail,
  password: strongPassword,  // ← Use strong password
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(20, { message: "First name must not exceed 20 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(20, { message: "Last name must not exceed 20 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Password reset validation (frontend)
export const resetPasswordSchema = z
  .object({
    password: strongPassword,  // ← Use strong password
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile update validation schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(20, { message: "First name must not exceed 20 characters" })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(20, { message: "Last name must not exceed 20 characters" })
    .optional(),
  profilePicture: z.string().url({ message: "Invalid URL format" }).optional(),
  bio: z
    .string()
    .max(250, { message: "Bio must not exceed 250 characters" })
    .optional(),
  city: z
    .string()
    .max(50, { message: "City must not exceed 50 characters" })
    .optional(),
  websites: z
    .array(z.string().url({ message: "Invalid URL format" }))
    .max(5, { message: "You can add up to 5 websites" })
    .optional(),
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;