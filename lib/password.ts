import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [algorithm, saltHex, hashHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  if (salt.length !== 16 || expected.length !== 64) return false;
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}
