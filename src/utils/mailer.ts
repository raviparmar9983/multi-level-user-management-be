import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

export const verifyTransporter = async (): Promise<void> => {
  try {
    await transporter.verify();
    console.log("Mail server is ready");
  } catch (error) {
    console.error("Mail server error:", error);
  }
};

interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export const sendMail = async ({
  to,
  subject,
  html,
  text,
}: SendMailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};