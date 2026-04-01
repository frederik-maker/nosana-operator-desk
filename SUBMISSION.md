# Nosana Submission Pack

## Project Name

Operator Desk

## Project Description (300 words max)

Operator Desk is a personal AI chief-of-staff built with ElizaOS and designed to run on Nosana's decentralized GPU network. The project focuses on a simple but high-value workflow: turning messy personal context into a ranked daily action board. A user gives the agent notes, watchlist items, open tasks, or research links, and Operator Desk compresses them into the top priorities, open risks, suggested next actions, and a short research summary when needed. Instead of acting like a generic chatbot, it is designed to answer the question "what matters today?" with direct, structured output. This fork customizes the official Nosana challenge starter with a project-specific character, a dedicated operator-brief action, a cleaner environment setup for the Nosana-hosted Qwen3.5 model, and a custom dashboard mockup that shows how the live experience should look beyond the default client. The goal is to make decentralized personal AI feel useful on day one: less novelty, more leverage. It is especially relevant for solo builders, researchers, and traders who need a reliable morning briefing layer that runs on infrastructure they control rather than a centralized cloud black box.

## Submission Fields To Fill In

- Public GitHub fork: `https://github.com/frederik-maker/nosana-operator-desk`
- Live Nosana deployment URL: `https://LXzwNDzDA6vdBN1aB9D6SGn3FK3q9wi18seHwWbXBVm7.node.k8s.prd.nos.ci`
- Video demo link: `[PASTE VIDEO URL]`

## Current Status

- Docker image pushed: `frederikbus/nosana-operator-desk:amd64`
- Latest live image digest: `sha256:35c01535c7f2dd19db6b3e7a43090ac19726a8a49aed14c2609c330afa1fc8da`
- Local smoke test passed on April 1, 2026: the container stayed up and served the ElizaOS client on `http://127.0.0.1:3000`
- Job definition fix applied on April 1, 2026: added the required top-level `"type": "container"` field to `nos_job_def/nosana_eliza_job_definition.json`
- Architecture fix applied on April 1, 2026: published a dedicated `amd64` image tag after Nosana nodes rejected the original arm64-only image with `image not known`
- Premium deployment now live on April 1, 2026:
  - Deployment ID: `9T9DhDCn5sNomB82fmiu2ckKrSftxVffaivVYVn3eAKP`
  - Job ID: `7qAzaMVbxGtMAPtbNuRE7UvcB8qN5drknajXENAgGmyR`
  - Endpoint URL: `https://LXzwNDzDA6vdBN1aB9D6SGn3FK3q9wi18seHwWbXBVm7.node.k8s.prd.nos.ci`
  - Current deployment status: `RUNNING`
  - Current public app shell response: `HTTP/2 200`
- Remaining human-only blockers: record the sub-60-second demo, publish the social post in `SOCIAL_POST.md`, and star the required repos before final Superteam submission

## Required Pre-Submit Checklist

- Star `agent-challenge`, `nosana-programs`, `nosana-kit`, and `nosana-cli`.
- Push the repo to a public GitHub fork.
- Build and push the Docker image.
- Update the Docker image reference in `nos_job_def/nosana_eliza_job_definition.json`.
- Claim or add Nosana credits, then re-run `npm run deploy:nosana` if you need to redeploy.
- Confirm the live endpoint still loads before recording the demo.
- Record a sub-60-second demo.
- Publish the social post in `SOCIAL_POST.md`.
