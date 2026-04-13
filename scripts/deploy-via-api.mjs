import { readFile } from "node:fs/promises";

const API_KEY = process.env.NOSANA_API_KEY;
const API_BASE_URL =
  process.env.NOSANA_API_BASE_URL || "https://dashboard.k8s.prd.nosana.com/api";

if (!API_KEY) {
  console.error("Missing NOSANA_API_KEY in the environment.");
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const deploymentName = args.name || process.env.NOSANA_DEPLOYMENT_NAME || "Operator Desk Premium";
const market =
  args.market ||
  process.env.NOSANA_MARKET ||
  "7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq";
const timeout = Number(args.timeout || process.env.NOSANA_TIMEOUT || 2880);
const replicas = Number(args.replicas || process.env.NOSANA_REPLICAS || 1);
const strategy = args.strategy || process.env.NOSANA_STRATEGY || "INFINITE";
const openAiApiKey = args.openaiApiKey || process.env.OPENAI_API_KEY;
const openAiBaseUrl =
  args.openaiBaseUrl ||
  args.openaiApiUrl ||
  process.env.OPENAI_BASE_URL ||
  process.env.OPENAI_API_URL;
const modelName =
  args.modelName ||
  process.env.OPENAI_LARGE_MODEL ||
  process.env.OPENAI_SMALL_MODEL ||
  process.env.MODEL_NAME;
const jobPath =
  args.job || process.env.NOSANA_JOB_DEFINITION || "./nos_job_def/nosana_eliza_job_definition.json";
const shouldStart = args.start !== "false";
const pollAttempts = Number(args.pollAttempts || process.env.NOSANA_POLL_ATTEMPTS || 12);
const pollIntervalMs = Number(args.pollIntervalMs || process.env.NOSANA_POLL_INTERVAL_MS || 5000);
const startAttempts = Number(args.startAttempts || process.env.NOSANA_START_ATTEMPTS || 3);

const jobDefinition = JSON.parse(await readFile(jobPath, "utf8"));
const containerEnv = jobDefinition.ops?.[0]?.args?.env;

if (containerEnv) {
  if (openAiApiKey) {
    containerEnv.OPENAI_API_KEY = openAiApiKey;
  }

  if (openAiBaseUrl) {
    containerEnv.OPENAI_BASE_URL = openAiBaseUrl;
    delete containerEnv.OPENAI_API_URL;
  }

  if (modelName) {
    containerEnv.OPENAI_SMALL_MODEL = modelName;
    containerEnv.OPENAI_LARGE_MODEL = modelName;
    containerEnv.MODEL_NAME = modelName;
  }
}

const created = await apiFetch("/deployments/create", {
  method: "POST",
  body: JSON.stringify({
    name: deploymentName,
    market,
    replicas,
    timeout,
    strategy,
    job_definition: jobDefinition,
  }),
});

console.log(`Created deployment: ${created.id}`);
console.log(`Endpoint: ${created.endpoints?.[0]?.url ?? "N/A"}`);

if (!shouldStart) {
  process.exit(0);
}

await startDeployment(created.id, startAttempts);

console.log("Start requested. Polling deployment status...");

for (let attempt = 1; attempt <= pollAttempts; attempt += 1) {
  await sleep(pollIntervalMs);

  const deployment = await apiFetch(`/deployments/${created.id}`);
  const endpoint = deployment.endpoints?.[0]?.url ?? "N/A";

  console.log(`[${attempt}/${pollAttempts}] status=${deployment.status} endpoint=${endpoint}`);

  if (deployment.status === "RUNNING") {
    process.exit(0);
  }

  if (deployment.status === "ERROR") {
    const events = await apiFetch(`/deployments/${created.id}/events`);
    const latestEvent = events.events?.[0];

    if (latestEvent) {
      console.error(`Latest event: ${latestEvent.type} - ${latestEvent.message}`);
    }

    process.exit(1);
  }
}

console.error("Deployment is still not RUNNING after polling. Check the Nosana dashboard for more detail.");
process.exit(1);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

async function apiFetch(path, init = {}) {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    ...(init.headers || {}),
  };

  if (
    init.body != null &&
    !Object.keys(headers).some((key) => key.toLowerCase() === "content-type")
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(`Nosana API ${response.status}: ${text}`);
    error.response = json;
    throw error;
  }

  return json;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startDeployment(deploymentId, attempts) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await apiFetch(`/deployments/${deploymentId}/start`, {
        method: "POST",
      });
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `Start attempt ${attempt}/${attempts} failed: ${error.message}`
      );
      if (attempt < attempts) {
        await sleep(2000);
      }
    }
  }

  throw lastError;
}
