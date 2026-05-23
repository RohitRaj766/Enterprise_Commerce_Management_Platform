import { z } from 'zod';

// Phone number validation (accepts numbers only, validation happens with country code)
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers')
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number must be at most 10 digits'),
});

// OTP validation
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(4, 'OTP must be 4 digits')
    .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});

// Email validation
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Sign up schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

// Location schema
export const locationSchema = z.object({
  zone: z.string().min(1, 'Please select a zone'),
  area: z.string().min(1, 'Please select an area'),
});

// Type exports for form data
export type PhoneNumberFormData = z.infer<typeof phoneNumberSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;

