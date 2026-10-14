// Flowchart ASCII renderer, adapted from beautiful-mermaid (MIT).
// The ASCII engine is based on mermaid-ascii by Alexander Grooff.

import { parseMermaid } from '../parser.js'
import { convertToAsciiGraph } from './converter.js'
import { createMapping } from './grid.js'
import { drawGraph } from './draw.js'
import { canvasToString, flipCanvasVertically, flipRoleCanvasVertically } from './canvas.js'
import { DEFAULT_ASCII_THEME } from './ansi.js'
import type { AsciiConfig, AsciiTheme, ColorMode } from './types.js'

export interface AsciiRenderOptions {
  /** true = ASCII chars (+,-,|,>), false = Unicode box-drawing. Default: false */
  useAscii?: boolean
  /** Horizontal spacing between nodes. Default: 5 */
  paddingX?: number
  /** Vertical spacing between nodes. Default: 5 */
  paddingY?: number
  /** Padding inside node boxes. Default: 1 */
  boxBorderPadding?: number
  /** Color mode. Chat output should use 'none'. Default: 'none' */
  colorMode?: ColorMode
  /** Theme colors. Unused when colorMode is 'none'. */
  theme?: Partial<AsciiTheme>
}

/**
 * Render Mermaid flowchart text to a Unicode box-drawing diagram.
 * Accepts `graph` and `flowchart` diagrams, including subgraphs.
 */
export function renderFlowchart(text: string, options: AsciiRenderOptions = {}): string {
  const config: AsciiConfig = {
    useAscii: options.useAscii ?? false,
    paddingX: options.paddingX ?? 5,
    paddingY: options.paddingY ?? 5,
    boxBorderPadding: options.boxBorderPadding ?? 1,
    graphDirection: 'TD',
  }

  const colorMode: ColorMode = options.colorMode ?? 'none'
  const theme: AsciiTheme = { ...DEFAULT_ASCII_THEME, ...options.theme }

  const parsed = parseMermaid(text)

  if (parsed.direction === 'LR' || parsed.direction === 'RL') {
    config.graphDirection = 'LR'
  } else {
    config.graphDirection = 'TD'
  }

  const graph = convertToAsciiGraph(parsed, config)
  createMapping(graph)
  drawGraph(graph)

  if (parsed.direction === 'BT') {
    flipCanvasVertically(graph.canvas)
    flipRoleCanvasVertically(graph.roleCanvas)
  }

  return canvasToString(graph.canvas, {
    roleCanvas: graph.roleCanvas,
    colorMode,
    theme,
  })
}
