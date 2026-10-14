/**
 * Normalize a Mermaid label: strip surrounding quotes, and turn <br> tags
 * and literal "\n" sequences into newline characters.
 */
export function normalizeBrTags(label: string): string {
  const unquoted = label.startsWith('"') && label.endsWith('"') ? label.slice(1, -1) : label
  return unquoted
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\\n/g, '\n')
    .replace(/<\/?(?:sub|sup|small|mark)\s*>/gi, '')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(?<!\*)\*([^\s*](?:[^*]*[^\s*])?)\*(?!\*)/g, '<i>$1</i>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
}
