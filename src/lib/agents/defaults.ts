import type { BusinessContext } from "./types";

export const DEFAULT_CONTEXT: BusinessContext = {
  name: "Lotus Lane",
  industry: "D2C specialty tea and snacks",
  stage: "pre-revenue",
  location: "Yangon, Myanmar",
  teamSize: 3,
  challenge:
    "Need a 90-day plan to win the first 100 paying customers without a large ad budget.",
};

export const STAGES: BusinessContext["stage"][] = [
  "idea",
  "pre-revenue",
  "early",
  "growth",
  "established",
];
