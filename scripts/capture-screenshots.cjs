const { createRequire } = require("node:module");
const fs = require("node:fs/promises");
const path = require("node:path");

const runtimeModules = "C:/Users/djsno/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
const requireFromRuntime = createRequire(runtimeModules);
const { chromium } = requireFromRuntime("playwright");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "docs", "wireframes-imagens");
const baseUrl = "http://127.0.0.1:4173/";
const gameUrl = `${baseUrl}jogo.html`;

async function capture(page, fileName, url, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(outputDir, fileName),
    fullPage: true
  });
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  const page = await browser.newPage();

  await capture(page, "00-presente-fechado.png", baseUrl, { width: 1536, height: 1024 });
  await page.click("#open-gift");
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outputDir, "01-presente-aberto.png"), fullPage: true });
  await capture(page, "02-desktop-jogo.png", `${gameUrl}?shot=desktop`, { width: 1536, height: 1024 });
  await capture(page, "03-desktop-dica.png", `${gameUrl}?demo=hint&shot=desktop`, { width: 1536, height: 1024 });
  await capture(page, "04-desktop-final.png", `${gameUrl}?demo=complete&shot=desktop`, { width: 1536, height: 1024 });
  await capture(page, "05-mobile-presente.png", baseUrl, { width: 390, height: 844 });
  await capture(page, "06-mobile-jogo.png", `${gameUrl}?shot=mobile`, { width: 390, height: 844 });

  await browser.close();

  console.log(outputDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
