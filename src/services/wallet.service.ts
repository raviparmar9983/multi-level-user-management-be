import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Transaction } from "../models/transaction.model";
import { TransactionType } from "../common/enum";

export class WalletService {
  static async recharge(userId: string, data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      if (!user) throw new Error("User not found");
      user.balance += data.amount;
      await user.save({ session });

      await Transaction.create(
        [
          {
            userId: user._id,
            type: TransactionType.CREDIT,
            amount: data.amount,
            description: "Wallet Recharge",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return user.balance;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async transfer(parentId: string, data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sender = await User.findById(parentId).session(session);
      const receiver = await User.findById(data.userId).session(session);

      if (!sender || !receiver) throw new Error("User not found");

      if (receiver.parentId?.toString() !== parentId) {
        throw new Error("Can only transfer to direct child");
      }

      if (sender.balance < data.amount) {
        throw new Error("Insufficient balance");
      }

      sender.balance -= data.amount;
      await sender.save({ session });

      receiver.balance += data.amount;
      await receiver.save({ session });

      await Transaction.create(
        [
          {
            userId: sender._id,
            type: TransactionType.DEBIT,
            amount: data.amount,
            referenceUserId: receiver._id,
            description: "Transfer to child",
          },
          {
            userId: receiver._id,
            type: TransactionType.CREDIT,
            amount: data.amount,
            referenceUserId: sender._id,
            description: "Received from parent",
          },
        ],
        { session, ordered: true }
      );

      await session.commitTransaction();
      session.endSession();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}