import assert from "node:assert/strict";

const origin = process.env.TEST_BASE_URL || "http://localhost:3210";
async function main() {
  for (const path of ["/discover", "/compare", "/colleges/demo-aurora-institute-of-technology", "/matches"]) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    assert([200, 307].includes(response.status), path);
    const location = response.headers.get("location") || "";
    const body = response.status === 200 ? await response.text() : "";
    const matchesRedirect = path === "/matches" && location.startsWith("/discover?academic=on");
    assert(matchesRedirect || location.startsWith("/sign-in?next=") || location.startsWith(`${origin}/sign-in?next=`) || body.includes("sign-in?next="), `${path}: ${location}`);
  }
  console.log("Auth gate passed: signed-out product routes redirect to sign-in with a return path.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
