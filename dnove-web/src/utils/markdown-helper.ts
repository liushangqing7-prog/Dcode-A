import { marked } from 'marked';

export const renderMarkdown = (text: string) => marked.parse(text) as string;
