import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Transaction } from "../models/transaction.model";
import { TransactionType, UserRole } from "../common/enum";

export class AdminService {
    static async getRootUsers(query: any) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { parentId: null, role: UserRole.USER };

        const users = await User.find(filter)
            .select("_id name balance level")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                hasNext: page * limit < total,
            },
        };
    }

    static async transferToUser(data: any) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { userId, amount } = data;

            const child = await User.findById(userId).session(session);
            if (!child) throw new Error("User not found");

            if (!child.parentId) {
                throw new Error("User has no parent");
            }

            const parent = await User.findById(child.parentId).session(session);
            if (!parent) throw new Error("Parent not found");

            if (parent.balance < amount) {
                throw new Error("Parent has insufficient balance");
            }

            parent.balance -= amount;
            await parent.save({ session });

            child.balance += amount;
            await child.save({ session });

            await Transaction.create(
                [
                    {
                        userId: parent._id,
                        type: TransactionType.DEBIT,
                        amount,
                        referenceUserId: child._id,
                        description: "Admin transfer to child",
                    },
                    {
                        userId: child._id,
                        type: TransactionType.CREDIT,
                        amount,
                        referenceUserId: parent._id,
                        description: "Received from parent via admin",
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