import dotenv from 'dotenv';
import { EnvConfig } from '../types/env.config';
dotenv.config()

export const env: EnvConfig = {
  PORT: Number(process.env.PORT ?? 3000),
  DB_URL: process.env.DB_URL ?? '',
  SALT_ROUND: Number(process.env.SALT_ROUNDS) || 10,
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  MAIL_HOST: process.env.MAIL_HOST ?? '',
  MAIL_PORT: Number(process.env.MAIL_PORT ?? 0),
  MAIL_USER: process.env.MAIL_USER ?? '',
  MAIL_PASS: process.env.MAIL_PASS ?? '',
  MAIL_FROM: process.env.MAIL_FROM ?? '',
  FRONTEND_URL: process.env.FRONTEND_URL ?? '',
  API_URL:process.env.API_URL ??''
}