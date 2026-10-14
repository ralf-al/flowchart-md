import { renderFlowchart } from './ascii/index.js'

const FLOWCHART_HEADER = /^(?:graph|flowchart)\s+(?:TD|TB|LR|BT|RL)\s*$/i

/**
 * Turn Mermaid flowchart source into a markdown code block that chat can show.
 * Throws if the source is empty or is not a flowchart.
 */
export function renderFlowchartMarkdown(source: string): string {
  const header = source
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith('%%'))

  if (!header || !FLOWCHART_HEADER.test(header)) {
    throw new Error(
      'Expected a Mermaid flowchart. Start with "graph TD", "graph LR", "flowchart TB", or another graph/flowchart direction.',
    )
  }

  const diagram = renderFlowchart(source).replace(/\s+$/, '')
  return `\`\`\`text\n${diagram}\n\`\`\``
}
