import * as yup from "yup";

export const adminTransferSchema = yup.object({
    userId: yup.string().required(),
    amount: yup.number().positive().required(),
});