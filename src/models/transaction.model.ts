import mongoose, { Schema } from "mongoose";
import { TransactionType, TransactionStatus } from "../common/enum";
import { ITransaction } from "../types/transaction.types";

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.SUCCESS,
    },

    referenceUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    description: String,
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);