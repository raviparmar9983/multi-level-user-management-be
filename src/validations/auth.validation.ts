import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().trim().required("Name is required"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().email().required("Email is required"),

  password: yup.string().required("Password is required"),
});

export const refreshTokenSchema = yup.object({
  token: yup.string().required("Refresh token is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email().required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  token: yup.string().required("Token is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});