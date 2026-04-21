import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { Socket, connect as connectTcp } from "node:net";
import { hostname } from "node:os";
import { connect as connectTls, TLSSocket } from "node:tls";

import { assertSmtpEnv } from "@/lib/env/smtp";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type SocketState = {
  buffer: string;
};

type SmtpResponse = {
  code: number;
  lines: string[];
};

function encodeBase64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

function normalizeSmtpContent(value: string) {
  return value.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n").replace(/(^|\r\n)\./g, "$1..");
}

function getFromHeader(fromName: string, fromEmail: string) {
  const safeName = fromName.replaceAll('"', "");
  return `"${safeName}" <${fromEmail}>`;
}

function buildMimeMessage(input: SendEmailInput, fromHeader: string, messageIdDomain: string) {
  const boundary = `atriae_${randomUUID()}`;
  const headers = [
    `From: ${fromHeader}`,
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${randomUUID()}@${messageIdDomain}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary=\"${boundary}\"`
  ];

  if (input.replyTo) {
    headers.push(`Reply-To: ${input.replyTo}`);
  }

  const parts = [
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    normalizeSmtpContent(input.text),
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    normalizeSmtpContent(input.html),
    `--${boundary}--`,
    ""
  ];

  return `${headers.join("\r\n")}\r\n\r\n${parts.join("\r\n")}`;
}

async function connectSocket(host: string, port: number): Promise<Socket> {
  const socket = connectTcp(port, host);
  socket.setEncoding("utf8");
  await once(socket, "connect");
  return socket;
}

async function upgradeToTls(socket: Socket, host: string): Promise<TLSSocket> {
  const tlsSocket = connectTls({ socket, host, servername: host });
  tlsSocket.setEncoding("utf8");
  await once(tlsSocket, "secureConnect");
  return tlsSocket;
}

async function readResponse(socket: Socket, state: SocketState): Promise<SmtpResponse> {
  const lines: string[] = [];

  while (true) {
    const chunks = state.buffer.split("\r\n");
    state.buffer = chunks.pop() ?? "";

    for (const line of chunks) {
      if (!line) {
        continue;
      }

      lines.push(line);
      if (/^\d{3} /.test(line)) {
        const code = Number(line.slice(0, 3));
        return { code, lines };
      }
    }

    const dataPromise = once(socket, "data") as Promise<[string]>;
    const errorPromise = once(socket, "error").then((args) => {
      throw args[0];
    });
    const closePromise = once(socket, "close").then(() => {
      throw new Error("SMTP socket closed unexpectedly.");
    });

    const [data] = (await Promise.race([dataPromise, errorPromise, closePromise])) as [string];
    state.buffer += data;
  }
}

async function command(
  socket: Socket,
  state: SocketState,
  value: string,
  expectedCodes: number[]
): Promise<SmtpResponse> {
  socket.write(`${value}\r\n`);
  const response = await readResponse(socket, state);

  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed (${value.split(" ")[0]}): ${response.lines.join(" | ")}`);
  }

  return response;
}

async function sendViaSmtp(input: SendEmailInput, verifyOnly: boolean) {
  const smtp = assertSmtpEnv();
  const state: SocketState = { buffer: "" };

  let socket = await connectSocket(smtp.host, smtp.port);

  try {
    const greeting = await readResponse(socket, state);
    if (greeting.code !== 220) {
      throw new Error(`SMTP greeting failed: ${greeting.lines.join(" | ")}`);
    }

    const localHost = hostname() || "localhost";
    const ehloResponse = await command(socket, state, `EHLO ${localHost}`, [250]);

    const supportsStartTls = ehloResponse.lines.some((line) => line.toUpperCase().includes("STARTTLS"));
    if (smtp.port !== 465 && supportsStartTls) {
      await command(socket, state, "STARTTLS", [220]);
      const tlsSocket = await upgradeToTls(socket, smtp.host);
      socket = tlsSocket;
      state.buffer = "";
      await command(socket, state, `EHLO ${localHost}`, [250]);
    }

    await command(socket, state, "AUTH LOGIN", [334]);
    await command(socket, state, encodeBase64(smtp.user), [334]);
    await command(socket, state, encodeBase64(smtp.pass), [235]);

    if (!verifyOnly) {
      const fromHeader = getFromHeader(smtp.fromName, smtp.fromEmail);
      await command(socket, state, `MAIL FROM:<${smtp.fromEmail}>`, [250]);
      await command(socket, state, `RCPT TO:<${input.to}>`, [250, 251]);
      await command(socket, state, "DATA", [354]);

      const payload = buildMimeMessage(input, fromHeader, smtp.host);
      socket.write(`${payload}\r\n.\r\n`);
      const dataResponse = await readResponse(socket, state);

      if (dataResponse.code !== 250) {
        throw new Error(`SMTP DATA failed: ${dataResponse.lines.join(" | ")}`);
      }

      await command(socket, state, "QUIT", [221]);

      const idLine = dataResponse.lines.find((line) => line.includes("queued") || line.includes("Ok"));
      return {
        ok: true as const,
        messageId: idLine ?? `<${randomUUID()}@${smtp.host}>`
      };
    }

    await command(socket, state, "QUIT", [221]);

    return {
      ok: true as const,
      host: smtp.host,
      port: smtp.port
    };
  } finally {
    socket.destroy();
  }
}

export async function verifySmtpTransport() {
  try {
    const result = await sendViaSmtp({ to: "verify@example.com", subject: "", html: "", text: "" }, true);
    return result;
  } catch (error) {
    console.error("[email][smtp-verify-failed]", {
      message: error instanceof Error ? error.message : "Unknown SMTP verify failure"
    });

    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Unknown SMTP verify failure"
    };
  }
}

export async function sendEmail(input: SendEmailInput) {
  try {
    return await sendViaSmtp(input, false);
  } catch (error) {
    console.error("[email][smtp-send-failed]", {
      to: input.to,
      subject: input.subject,
      message: error instanceof Error ? error.message : "Unknown SMTP send failure"
    });

    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Unknown SMTP send failure"
    };
  }
}
