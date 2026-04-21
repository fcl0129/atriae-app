import test from "node:test";
import assert from "node:assert/strict";

import { isValidEmail, isValidIanaTimeZone, redactSmtpError } from "./validation.ts";

test("isValidEmail accepts well-formed emails", () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail(" team+ops@sub.example.co "), true);
});

test("isValidEmail rejects malformed emails", () => {
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail("missing-domain@"), false);
});

test("isValidIanaTimeZone validates timezone names", () => {
  assert.equal(isValidIanaTimeZone("America/New_York"), true);
  assert.equal(isValidIanaTimeZone("Mars/Base"), false);
});

test("redactSmtpError returns safe user-facing messages", () => {
  assert.equal(
    redactSmtpError("Missing SMTP environment variables: SMTP_HOST"),
    "Email delivery is not configured. Please contact support.",
  );
  assert.equal(
    redactSmtpError("SMTP command failed (AUTH): 535 Invalid credentials"),
    "Email delivery authentication failed. Please contact support.",
  );
  assert.equal(
    redactSmtpError("SMTP DATA failed: 421 timeout"),
    "Email provider is temporarily unavailable. Please retry shortly.",
  );
});
