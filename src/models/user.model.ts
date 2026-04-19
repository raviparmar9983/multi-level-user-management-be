import mongoose, { Schema } from "mongoose";
import { UserRole } from "../common/enum";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    balance: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    path: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    level: {
      type: Number,
      default: 0,
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    verifyEmailToken: String,
    verifyEmailExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ parentId: 1 });
userSchema.index({ path: 1 });


userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);