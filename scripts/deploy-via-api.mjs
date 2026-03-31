import { readFile } from "node:fs/promises";

const API_KEY = process.env.NOSANA_API_KEY;

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
const timeout = Number(args.timeout || process.env.NOSANA_TIMEOUT || 60);
const replicas = Number(args.replicas || process.env.NOSANA_REPLICAS || 1);
const jobPath =
  args.job || process.env.NOSANA_JOB_DEFINITION || "./nos_job_def/nosana_eliza_job_definition.json";
const shouldStart = args.start !== "false";
const pollAttempts = Number(args.pollAttempts || process.env.NOSANA_POLL_ATTEMPTS || 12);
const pollIntervalMs = Number(args.pollIntervalMs || process.env.NOSANA_POLL_INTERVAL_MS || 5000);

const jobDefinition = JSON.parse(await readFile(jobPath, "utf8"));

const created = await apiFetch("/deployments/create", {
  method: "POST",
  body: JSON.stringify({
    name: deploymentName,
    market,
    replicas,
    timeout,
    strategy: "SIMPLE",
    job_definition: jobDefinition,
  }),
});

console.log(`Created deployment: ${created.id}`);
console.log(`Endpoint: ${created.endpoints?.[0]?.url ?? "N/A"}`);

if (!shouldStart) {
  process.exit(0);
}

await apiFetch(`/deployments/${created.id}/start`, {
  method: "POST",
});

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
  const response = await fetch(`https://dashboard.k8s.prd.nos.ci/api${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
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
