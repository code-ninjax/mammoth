import crypto from "crypto";

export function hashBuffer(data: Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}