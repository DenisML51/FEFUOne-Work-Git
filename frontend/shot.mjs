import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
await page.addInitScript(() => localStorage.clear());
await page.goto("http://127.0.0.1:4175/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Новая сессия" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: "shot-expanded.png", clip: { x: 0, y: 0, width: 420, height: 900 } });

await page.getByRole("button", { name: "Свернуть" }).click();
await page.waitForTimeout(90);
await page.screenshot({ path: "shot-mid.png", clip: { x: 0, y: 0, width: 420, height: 900 } });
await page.waitForTimeout(400);
await page.screenshot({ path: "shot-collapsed.png", clip: { x: 0, y: 0, width: 420, height: 900 } });

await browser.close();
