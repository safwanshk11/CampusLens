import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12, "Use at least 12 characters.").max(128),
}).strict();
export const registrationSchema = credentialsSchema.extend({ name: z.string().trim().min(1).max(80) });

export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || value.length > 2000 || /[\\\r\n]/.test(value)) return "/saved";
  try {
    const url = new URL(value, "https://campuslens.invalid");
    if (url.origin !== "https://campuslens.invalid" || !value.startsWith("/")) return "/saved";
    if (!["/discover", "/compare", "/saved"].includes(url.pathname) && !/^\/colleges\/[a-z0-9-]+$/.test(url.pathname)) return "/saved";
    return `${url.pathname}${url.search}`;
  } catch { return "/saved"; }
}
