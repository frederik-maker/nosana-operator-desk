/**
 * Custom Plugin Entry Point
 *
 * This file is where you can define custom actions, providers, and evaluators
 * for your ElizaOS agent. Add your logic here and reference this plugin in
 * your character file.
 *
 * ElizaOS Plugin Docs: https://elizaos.github.io/eliza/docs/core/plugins
 */

import { type Action, type Memory, type Plugin } from "@elizaos/core";

const BRIEF_KEYWORDS = [
  "daily brief",
  "morning brief",
  "operator brief",
  "what matters today",
  "top priorities",
  "action board",
  "rank my day",
];

const operatorBriefAction: Action = {
  name: "GENERATE_OPERATOR_BRIEF",
  description:
    "Trigger when the user asks for a daily brief, ranked priorities, or a concise action board.",
  similes: [
    "DAILY_BRIEF",
    "MORNING_BOARD",
    "WHAT_MATTERS_TODAY",
    "PRIORITIZE_MY_DAY",
  ],
  validate: async (_runtime: unknown, message: Memory) => {
    const text = message.content.text?.toLowerCase() ?? "";
    return BRIEF_KEYWORDS.some((keyword) => text.includes(keyword));
  },
  handler: async (_runtime: unknown, message: Memory) => {
    const prompt = message.content.text ?? "";

    console.log("OperatorDesk brief request:", prompt);

    return {
      success: true,
      text: "Here is your operator brief: top priorities, open risks, and the clearest next actions based on what you shared.",
      data: {
        actionName: "GENERATE_OPERATOR_BRIEF",
        prompt,
      },
    };
  },
  examples: [
    [
      {
        name: "{{user}}",
        content: {
          text: "Give me a morning brief for my watchlist and top tasks.",
        },
      },
      {
        name: "{{agent}}",
        content: {
          text: "Here is your operator brief with the top priorities, open risks, and suggested next actions.",
        },
      },
    ],
  ],
};

export const operatorDeskPlugin: Plugin = {
  name: "operator-desk-plugin",
  description: "Custom actions for generating structured operator briefs.",
  actions: [operatorBriefAction],
  providers: [],
  evaluators: [],
};

export default operatorDeskPlugin;
