const SMTP_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM_EMAIL",
  "SMTP_FROM_NAME"
] as const;

type SmtpEnvKey = (typeof SMTP_ENV_KEYS)[number];

export type SmtpEnv = {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
};

function readRawSmtpEnv() {
  return {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME
  };
}

export function getSmtpEnv(): Partial<Record<SmtpEnvKey, string>> {
  return readRawSmtpEnv();
}

export function assertSmtpEnv(): SmtpEnv {
  const rawEnv = readRawSmtpEnv();

  const missing = SMTP_ENV_KEYS.filter((key) => !rawEnv[key]);
  if (missing.length > 0) {
    throw new Error(`Missing SMTP environment variables: ${missing.join(", ")}`);
  }

  const port = Number(rawEnv.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  return {
    host: rawEnv.SMTP_HOST as string,
    port,
    user: rawEnv.SMTP_USER as string,
    pass: rawEnv.SMTP_PASS as string,
    fromEmail: rawEnv.SMTP_FROM_EMAIL as string,
    fromName: rawEnv.SMTP_FROM_NAME as string
  };
}
