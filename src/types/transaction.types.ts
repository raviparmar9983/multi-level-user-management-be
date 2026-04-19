import mongoose from "mongoose";
import { TransactionStatus, TransactionType } from "../common/enum";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;

  referenceUserId?: mongoose.Types.ObjectId; 
  description?: string;

  createdAt: Date;
}
