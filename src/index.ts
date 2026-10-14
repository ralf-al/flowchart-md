#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { renderFlowchartMarkdown } from "./render/flowchart.js";

const flowchartOutputSchema = z.object({
  markdown: z
    .string()
    .describe(
      "The diagram as a markdown code block. Paste this into the reply exactly as returned. It is already fenced, so do not wrap it again.",
    ),
});

function buildServer(): McpServer {
  const server = new McpServer({
    name: "flowchart-md",
    version: "1.0.0",
  });

  server.registerTool(
    "render-flowchart",
    {
      title: "Print a flowchart",
      description: [
        "Print a flowchart as markdown when a process, decision, or workflow is easier to check as a picture.",
        "Agents already write markdown well. This tool gives them a flowchart in that same markdown, so the picture shows up in chat.",
        "Paste the returned markdown into the reply unchanged. Do not wrap it in another code fence.",
        "Use graph TD for a top-to-bottom process. Use graph LR for a left-to-right pipeline.",
        "Steps are A[Do the thing]. Decisions are B{Question?}. Start and end can be C([Start]).",
        "Connect them with A --> B, and label branches with B -->|Yes| C and B -->|No| D.",
        "Keep each label to a few words. One flowchart per call.",
        "graph and flowchart diagrams work. Sequence, class, state, and ER diagrams do not.",
      ].join(" "),
      inputSchema: z.object({
        mermaid: z.string().describe(
          [
            "Flowchart source. Start with graph TD or graph LR.",
            "Example:",
            "graph TD",
            "  A[Start] --> B{Logged in?}",
            "  B -->|Yes| C[Show home]",
            "  B -->|No| D[Show login]",
          ].join("\n"),
        ),
      }),
      outputSchema: flowchartOutputSchema,
    },
    async ({ mermaid }) => {
      const markdown = renderFlowchartMarkdown(mermaid);
      return {
        content: [{ type: "text", text: markdown }],
        structuredContent: { markdown },
      };
    },
  );

  return server;
}

serveStdio(buildServer, {
  onerror: (error) => {
    console.error("Flowchart MCP server error:", error);
  },
});
console.error("flowchart-md running on stdio");
