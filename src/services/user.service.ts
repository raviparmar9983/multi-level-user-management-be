import { User } from "../models/user.model";
import { hashPassword } from "../utils/bcrypt";
import mongoose from "mongoose";

export class UserService {
  static async getDownlineUsers(userId: string, query: any) {
    const { page = 1, limit = 10, search = "" } = query;

    const skip = (page - 1) * limit;

    const filter: any = {
      path: new mongoose.Types.ObjectId(userId),
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  static async createChildUser(parentId: string, data: any) {
    const parent = await User.findById(parentId);
    if (!parent) throw new Error("Parent user not found");

    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already exists");

    const hashed = await hashPassword(data.password);

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: hashed,

      parentId: parent._id,
      path: [...parent.path, parent._id],
      level: parent.level + 1,
    });

    return newUser;
  }

  static async changeChildPassword(
    parentId: string,
    userId: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    if (user.parentId?.toString() !== parentId) {
      throw new Error("Not authorized to change this user's password");
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return true;
  }

  static async getUserBalance(userId: string) {
    const user = await User.findById(userId).select("balance");

    if (!user) {
      throw new Error("User not found");
    }

    return user.balance;
  }

  static async getDirectChildren(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const parentObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(parentObjectId)
    const children = await User.find({ parentId: parentObjectId })
      .select("_id name balance level parentId")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({ parentId: parentObjectId });

    const childIds = children.map((c) => c._id);

    const childrenWithKids = await User.aggregate([
      {
        $match: {
          parentId: { $in: childIds },
        },
      },
      {
        $group: {
          _id: "$parentId",
          count: { $sum: 1 },
        },
      },
    ]);

    const childMap = new Map(
      childrenWithKids.map((c) => [c._id.toString(), true])
    );

    const data = children.map((child) => ({
      _id: child._id,
      name: child.name,
      balance: child.balance,
      level: child.level,
      hasChildren: childMap.has(child._id.toString()),
      parentId: child.parentId
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        hasNext: page * limit < total,
      },
      user: {
        name: user?.name,
        balance: user?.balance,
        level: user?.level
      }
    };
  }

}