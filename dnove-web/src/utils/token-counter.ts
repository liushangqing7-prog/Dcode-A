export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateReadingMinutes(text: string): number {
  const wpm = 300;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wpm));
}
