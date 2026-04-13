# Nosana Submission Pack

## Project Name

Operator Desk

## Project Description (300 words max)

Operator Desk is a personal AI chief-of-staff built with ElizaOS and deployed on Nosana's decentralized GPU network. The project focuses on a simple but high-value workflow: turning messy personal context into a ranked daily action board. A user gives the agent notes, watchlist items, open tasks, or research links, and Operator Desk compresses them into top priorities, open risks, suggested next actions, and short research summaries when needed. Instead of acting like a generic chatbot, it is designed to answer the question "what matters today?" with direct, structured output. This fork customizes the official Nosana challenge starter with a project-specific character, a dedicated operator-brief action, production-safe environment handling for OpenAI-compatible backends, and a custom dashboard mockup that shows how the live experience should look beyond the default client. The goal is to make decentralized personal AI feel useful on day one: less novelty, more leverage. It is especially relevant for solo builders, researchers, and traders who need a reliable morning briefing layer that runs on infrastructure they control rather than a centralized cloud black box.

## Submission Fields To Fill In

- Public GitHub fork: `https://github.com/frederik-maker/nosana-operator-desk`
- Live Nosana deployment URL: `https://51AXd67DY8evrGJTS8PjQnPWFd8PUpbP4y2rtEQeGpqM.node.k8s.prd.nos.ci`
- Video demo file to upload: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/operator-desk-demo.mp4`
- Alternate video format: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/operator-desk-demo.webm`
- Proof screenshots folder: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/screenshots`
- Demo manifest: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/demo-manifest.json`
- Video demo link for the form: upload the MP4 above to Loom, Google Drive, Streamable, YouTube Unlisted, or X and paste that public share URL here.

## Current Status

- Docker image pushed: `frederikbus/nosana-operator-desk:amd64-openai-v3`
- Latest live image digest: `sha256:9b3b0d5462cda89c92b19d17ddd020c669af8edf3614a550ce33ec02a2b964e7`
- Local smoke test passed on April 1, 2026: the container stayed up and served the ElizaOS client on `http://127.0.0.1:3000`
- Job definition fix applied on April 1, 2026: added the required top-level `"type": "container"` field to `nos_job_def/nosana_eliza_job_definition.json`
- Architecture fix applied on April 1, 2026: published a dedicated `amd64` image tag after Nosana nodes rejected the original arm64-only image with `image not known`
- Runtime fix applied on April 13, 2026: stopped baking `.env` into the Docker image and switched deployment variables to `OPENAI_BASE_URL` plus explicit `OPENAI_SMALL_MODEL` / `OPENAI_LARGE_MODEL`, which prevents ElizaOS from overriding live deployment credentials at startup
- Current live deployment created on April 13, 2026:
  - Deployment ID: `4KdQC6krCsjLjqozW4z3Nudx58rE6Ph4Uyevr2fyYA3j`
  - Current job ID: `6qpFRqQeL88rbHwBPFLQLwDjxwr5PT2xyZoyqQVoQ8DD`
  - Endpoint URL: `https://51AXd67DY8evrGJTS8PjQnPWFd8PUpbP4y2rtEQeGpqM.node.k8s.prd.nos.ci`
  - Current deployment status: `RUNNING`
  - Current replica count: `1`
  - Current timeout: `2880` minutes
  - Current strategy: `INFINITE`
  - Current public app shell response: `HTTP/2 200` verified on April 13, 2026
  - Live chat response verified on April 13, 2026 using the public endpoint and prompt: "Say hello in one sentence and then give a 2-bullet market brief for SOL and BTC."
  - Public proof screenshot: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/live-v3-chat-proof.png`
- Honest caveat: "live indefinitely" on Nosana still depends on the account keeping enough credits and the network staying healthy. `INFINITE` is the best available deployment mode here, but it is not a literal forever guarantee independent of credits/platform uptime.
- Demo assets generated on April 13, 2026:
  - Silent MP4: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/operator-desk-demo.mp4`
  - Silent WEBM: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/operator-desk-demo.webm`
  - Screenshots: `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/screenshots`
- Remaining human-only blockers: upload the MP4 to a public share link, publish the social post in `SOCIAL_POST.md`, star the required repos if you have not already, and submit the form.

## Required Pre-Submit Checklist

- Star `agent-challenge`, `nosana-programs`, `nosana-kit`, and `nosana-cli`.
- Push the repo to a public GitHub fork.
- Build and push the Docker image.
- Update the Docker image reference in `nos_job_def/nosana_eliza_job_definition.json`.
- Claim or add Nosana credits, then re-run `npm run deploy:nosana` if you need to redeploy.
- Confirm the live endpoint still loads before recording the demo.
- Upload `/Users/frederikbussler/competition-submissions/nosana-operator-desk/demo/operator-desk-demo.mp4` to a public video host and paste the share link into the submission form.
- Publish the social post in `SOCIAL_POST.md`.
