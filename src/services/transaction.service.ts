import { Transaction } from "../models/transaction.model";

export class TransactionService {
  static async getUserTransactions(userId: string, query: any) {
    const {
      page = 1,
      limit = 10,
      type,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;

    const filter: any = {
      userId,
    };

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter)
      .populate("referenceUserId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    return {
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}