import crypto from "crypto";
import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { encryptJWT, decryptJWT } from "../utils/jwt";
import { sendMail } from "../utils/mailer";
import { env } from "../config/env";

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

export class AuthService {
  static async register(data: any) {
    const { name, email, password } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already exists");

    const hashed = await hashPassword(password);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashed,
      verifyEmailToken: verifyToken,
      verifyEmailExpires: Date.now() + 1000 * 60 * 60,
    });

    sendMail({
      to: email,
      subject: "Verify your account",
      html: `
    <h2>Welcome ${name} 👋</h2>
    <p>Please verify your email:</p>
    <a href="${env.API_URL}/api/auth/verify?token=${verifyToken}">
      Verify Email
    </a>
  `,
    });

    return user;
  }
  static async login(data: any) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const payload = { userId: user._id, role: user.role };

    const accessToken = await encryptJWT(payload, ACCESS_EXPIRY);
    const refreshToken = await encryptJWT(payload, REFRESH_EXPIRY);

    user.resetPasswordToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    const decoded: any = await decryptJWT(token);

    const user = await User.findById(decoded.userId);
    if (!user || user.resetPasswordToken !== token)
      throw new Error("Invalid refresh token");

    const payload = { userId: user._id, role: user.role };

    const accessToken = await encryptJWT(payload, ACCESS_EXPIRY);

    return { accessToken };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = (Date.now() + 1000 * 60 * 10);
    await user.save();

    sendMail({
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Reset Password</h3>
        <a href="${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}">
          Reset Password
        </a>
      `,
    });
  }

  static async resetPassword(token: string, password: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid or expired token");

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
  }

  static async verifyEmail(token: string) {
    const user = await User.findOne({
      verifyEmailToken: token,
      verifyEmailExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpires = undefined;

    await user.save();

    return user;
  }
}