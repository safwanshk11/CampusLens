import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const derive = (password: string, salt: string) => new Promise<Buffer>((resolve, reject) => {
  scrypt(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key));
});
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1$${salt}$${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password: string, encoded: string | null) {
  const parts = encoded?.split("$");
  const valid = parts?.length === 3 && parts[0] === "scrypt-v1" && /^[a-f0-9]{32}$/.test(parts[1]) && /^[a-f0-9]{128}$/.test(parts[2]);
  // Dummy work prevents an immediate timing distinction for unknown/demo accounts.
  const actual = await derive(password, valid ? parts[1] : "0".repeat(32));
  return valid ? timingSafeEqual(actual, Buffer.from(parts[2], "hex")) : false;
}
