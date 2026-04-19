import * as yup from "yup";

export const rechargeSchema = yup.object({
  amount: yup.number().positive().required(),
  cardNumber: yup.string().required(),
  expiry: yup.string().required(),
  cvv: yup.string().required(),
});

export const transferSchema = yup.object({
  userId: yup.string().required(),
  amount: yup.number().positive().required(),
});