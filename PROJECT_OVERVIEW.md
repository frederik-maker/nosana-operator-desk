# Operator Desk

Operator Desk is a personal AI chief-of-staff agent built for the Nosana x ElizaOS challenge.

## Core idea

Most personal AI tools are good at chat and bad at prioritization. Operator Desk is built around one question:

"What matters today?"

It takes a user's notes, saved links, open tasks, and watchlist context, then compresses them into a ranked daily board:

- Top 3 priorities
- Open risks
- Watchlist changes
- Suggested next actions
- Optional short research summaries

## Why it fits the challenge

- Personal AI: it is centered on the user's own workflow.
- ElizaOS-native: the fork keeps the ElizaOS agent architecture and adds a project-specific action.
- Nosana-native: the environment and deployment files are set up for the Nosana-hosted Qwen endpoint and the Nosana deployment flow.
- Useful custom UX: the `ui/` folder contains a dashboard-style interface instead of relying only on a default chat window.

## Suggested next implementation steps

1. Wire the `ui/` mockup to the ElizaOS direct client or a thin API proxy.
2. Add persistence for saved briefs and watchlists.
3. Pull watchlist and task context from the user's real sources.
4. Deploy the container to Nosana and capture the demo flow from the live instance.
