import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../common/enum";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  parentId?: mongoose.Types.ObjectId | null;
  path: mongoose.Types.ObjectId[];
  level: number;

  role: UserRole;

  isVerified: boolean;
  balance: 0;
  passwordChangedAt?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date | number
  ;

  verifyEmailToken?: string;
  verifyEmailExpires?: number | Date;

  createdAt: Date;
  updatedAt: Date;
}
