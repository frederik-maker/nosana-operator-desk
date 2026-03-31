# Nosana Submission Pack

## Project Name

Operator Desk

## Project Description (300 words max)

Operator Desk is a personal AI chief-of-staff built with ElizaOS and designed to run on Nosana's decentralized GPU network. The project focuses on a simple but high-value workflow: turning messy personal context into a ranked daily action board. A user gives the agent notes, watchlist items, open tasks, or research links, and Operator Desk compresses them into the top priorities, open risks, suggested next actions, and a short research summary when needed. Instead of acting like a generic chatbot, it is designed to answer the question "what matters today?" with direct, structured output. This fork customizes the official Nosana challenge starter with a project-specific character, a dedicated operator-brief action, a cleaner environment setup for the Nosana-hosted Qwen3.5 model, and a custom dashboard mockup that shows how the live experience should look beyond the default client. The goal is to make decentralized personal AI feel useful on day one: less novelty, more leverage. It is especially relevant for solo builders, researchers, and traders who need a reliable morning briefing layer that runs on infrastructure they control rather than a centralized cloud black box.

## Submission Fields To Fill In

- Public GitHub fork: `https://github.com/frederik-maker/nosana-operator-desk`
- Live Nosana deployment URL: `[PASTE LIVE URL]`
- Video demo link: `[PASTE VIDEO URL]`

## Current Status

- Docker image pushed: `frederikbus/nosana-operator-desk:latest`
- Latest image digest: `sha256:99db2bf5ad6d7fa8fdf49208b057c3267b7be3b7d32b4996ca290470bd315b72`
- Local smoke test passed on April 1, 2026: the container stayed up and served the ElizaOS client on `http://127.0.0.1:3000`
- Job definition fix applied on April 1, 2026: added the required top-level `"type": "container"` field to `nos_job_def/nosana_eliza_job_definition.json`
- Community market test deployment created and started, then failed with: `Credit-based jobs are only allowed on premium markets. Community and other market types are not supported for credit payments.`
- Premium market deployment created successfully:
  - Deployment ID: `7HfQGmwmPTvo9HjH4T2qCXw4cM2vGPcTBcWmTCSxcqfh`
  - Endpoint URL: `https://3b9zEv5axy4xuzHe9KXZMpfpfvvZAj53DBQt6GWpxpys.node.k8s.prd.nos.ci`
- Current blocker: the provided Nosana API key is valid, but the premium deployment stops with `Insufficient credits. Available: $0.000, Required: $0.048`

## Required Pre-Submit Checklist

- Star `agent-challenge`, `nosana-programs`, `nosana-kit`, and `nosana-cli`.
- Push the repo to a public GitHub fork.
- Build and push the Docker image.
- Update the Docker image reference in `nos_job_def/nosana_eliza_job_definition.json`.
- Claim or add Nosana credits, then re-run `npm run deploy:nosana`.
- Deploy the container to Nosana until the endpoint is `RUNNING`.
- Record a sub-60-second demo.
- Publish the social post in `SOCIAL_POST.md`.
