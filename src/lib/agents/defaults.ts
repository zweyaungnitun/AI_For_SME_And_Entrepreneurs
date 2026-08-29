import { getShop } from "@/lib/sme/catalog";

export const DEFAULT_CONTEXT = getShop("daw-hla").context;

export const STAGES = [
  "idea",
  "pre-revenue",
  "early",
  "growth",
  "established",
] as const;
