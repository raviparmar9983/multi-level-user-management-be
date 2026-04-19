import * as yup from "yup";

export const createUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export const changePasswordSchema = yup.object({
  userId: yup.string().required(),
  newPassword: yup.string().min(6).required(),
});

export const getDownlineSchema = yup.object({
  page: yup.number().default(1),
  limit: yup.number().default(10),
  search: yup.string().optional(),
});