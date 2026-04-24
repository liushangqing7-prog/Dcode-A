import fm from 'front-matter';
import yaml from 'js-yaml';

export function parseCard<T>(raw: string): { attrs: Partial<T>; body: string } {
  const parsed = fm<{ [key: string]: unknown }>(raw);
  return { attrs: parsed.attributes as Partial<T>, body: parsed.body };
}

export function serializeCard(attrs: Record<string, unknown>, body: string): string {
  return `---\n${yaml.dump(attrs)}---\n\n${body}`;
}
