import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "demo");
const screenshotDir = path.join(outputDir, "screenshots");

const APP_URL =
  process.env.APP_URL ||
  "https://51AXd67DY8evrGJTS8PjQnPWFd8PUpbP4y2rtEQeGpqM.node.k8s.prd.nos.ci";
const DEMO_PROMPT =
  process.env.DEMO_PROMPT ||
  "Give me a concise morning brief for SOL, BTC, JTO, and PYTH with top priorities, open risks, and next actions.";

const VIEWPORT = { width: 1440, height: 900 };
const WEBM_PATH = path.join(outputDir, "operator-desk-demo.webm");
const MP4_PATH = path.join(outputDir, "operator-desk-demo.mp4");
const MANIFEST_PATH = path.join(outputDir, "demo-manifest.json");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureDirs() {
  await fs.mkdir(screenshotDir, { recursive: true });
}

async function maybeClick(locator) {
  if ((await locator.count()) > 0) {
    await locator.first().click();
    return true;
  }

  return false;
}

function findFfmpegBinary() {
  const candidates = [
    process.env.FFMPEG_PATH,
    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/Users/frederikbussler/Library/Caches/ms-playwright/ffmpeg-1011/ffmpeg-mac",
  ].filter(Boolean);

  return candidates[0] || null;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function convertToMp4(sourcePath, targetPath) {
  const ffmpegPath = findFfmpegBinary();
  if (!ffmpegPath || !(await fileExists(ffmpegPath))) {
    return { converted: false, reason: "ffmpeg-not-found" };
  }

  return new Promise((resolve) => {
    const proc = spawn(
      ffmpegPath,
      [
        "-y",
        "-i",
        sourcePath,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        targetPath,
      ],
      { stdio: "ignore" }
    );

    proc.on("exit", (code) => {
      resolve({
        converted: code === 0,
        reason: code === 0 ? "ok" : `ffmpeg-exit-${code}`,
      });
    });
  });
}

async function captureDemo() {
  await ensureDirs();
  const existingVideoFiles = new Set(await fs.readdir(outputDir).catch(() => []));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: outputDir,
      size: VIEWPORT,
    },
  });
  const page = await context.newPage();
  const video = page.video();

  page.setDefaultTimeout(20_000);

  await page.goto(APP_URL, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  await sleep(3_000);

  await page.screenshot({
    path: path.join(screenshotDir, "01-home-shell.png"),
    fullPage: true,
  });

  await maybeClick(page.getByRole("button", { name: "Skip" }));
  await sleep(700);
  await maybeClick(page.getByRole("button", { name: "OperatorDesk" }));
  await sleep(2_000);

  await page.screenshot({
    path: path.join(screenshotDir, "02-chat-ready.png"),
    fullPage: true,
  });

  const textarea = page.getByPlaceholder("Type your message here...");
  let promptSubmitted = false;

  if ((await textarea.count()) > 0) {
    await textarea.fill(DEMO_PROMPT);
    await page.getByTestId("send-button").click();
    promptSubmitted = true;
    await sleep(3_000);

    await page.screenshot({
      path: path.join(screenshotDir, "03-prompt-submitted.png"),
      fullPage: true,
    });

    await sleep(15_000);

    const bodyText = await page.locator("body").innerText();
    const responseFile = bodyText.includes("OperatorDesk is thinking")
      ? "04-thinking-state.png"
      : "04-response-state.png";

    await page.screenshot({
      path: path.join(screenshotDir, responseFile),
      fullPage: true,
    });
  }

  await maybeClick(page.getByRole("button", { name: "Logs" }));
  await sleep(1_500);
  await page.screenshot({
    path: path.join(screenshotDir, "05-logs-view.png"),
    fullPage: true,
  });

  await maybeClick(page.getByRole("button", { name: "Settings" }));
  await sleep(1_500);
  await page.screenshot({
    path: path.join(screenshotDir, "06-settings-view.png"),
    fullPage: true,
  });

  await context.close();
  await video.saveAs(WEBM_PATH);
  await browser.close();

  const outputFiles = await fs.readdir(outputDir);
  await Promise.all(
    outputFiles
      .filter((name) => name.endsWith(".webm") && name !== path.basename(WEBM_PATH))
      .filter((name) => !existingVideoFiles.has(name))
      .map((name) => fs.rm(path.join(outputDir, name), { force: true }))
  );

  const mp4Result = await convertToMp4(WEBM_PATH, MP4_PATH);
  const manifest = {
    generatedAt: new Date().toISOString(),
    appUrl: APP_URL,
    promptSubmitted,
    files: {
      webm: WEBM_PATH,
      mp4: mp4Result.converted ? MP4_PATH : null,
      screenshots: screenshotDir,
    },
    mp4Conversion: mp4Result,
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(JSON.stringify(manifest, null, 2));
}

captureDemo().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
