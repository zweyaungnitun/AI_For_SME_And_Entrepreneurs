import type { Metadata } from "next";
import { Workspace } from "@/components/console/Workspace";
import { specialists } from "@/lib/agents/registry";
import type { AgentId } from "@/lib/agents/types";

export const metadata: Metadata = {
  title: "Console · Foundry",
};

const crew: Array<{
  id: AgentId;
  name: string;
  title: string;
  accent: string;
}> = [
  {
    id: "conductor",
    name: "Conductor",
    title: "Routes and synthesizes",
    accent: "#c4622d",
  },
  ...specialists.map((agent) => ({
    id: agent.id,
    name: agent.name,
    title: agent.title,
    accent: agent.accent,
  })),
];

export default function ConsolePage() {
  return <Workspace crew={crew} />;
}
