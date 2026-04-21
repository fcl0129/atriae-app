const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return SIMPLE_EMAIL_REGEX.test(value.trim());
}

export function isValidIanaTimeZone(value: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const SAFE_SMTP_ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /missing smtp environment/i, message: "Email delivery is not configured. Please contact support." },
  { pattern: /auth/i, message: "Email delivery authentication failed. Please contact support." },
  { pattern: /\b(4\d\d)\b/, message: "Email provider is temporarily unavailable. Please retry shortly." },
  { pattern: /\b(5\d\d)\b/, message: "Email provider rejected the message. Please verify recipient settings and retry." },
  { pattern: /timeout|timed out/i, message: "Email delivery timed out. Please retry shortly." },
];

export function redactSmtpError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);

  for (const candidate of SAFE_SMTP_ERROR_PATTERNS) {
    if (candidate.pattern.test(raw)) {
      return candidate.message;
    }
  }

  return "Email delivery failed unexpectedly. Please retry.";
}
