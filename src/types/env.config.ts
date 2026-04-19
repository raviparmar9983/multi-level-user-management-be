export interface EnvConfig {
  PORT: number;
  DB_URL: string;
  SALT_ROUND: number;
  JWT_SECRET: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;
  FRONTEND_URL: string;
  API_URL: string;
}