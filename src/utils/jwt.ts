import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { env } from "../config/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export const encryptJWT = async (
  payload: JWTPayload,
  expiresIn: string 
): Promise<string> => {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);

    return token;
  } catch (error) {
    throw new Error("Error creating JWT");
  }
};

export const decryptJWT = async <T = JWTPayload>(
  token: string
): Promise<T> => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};