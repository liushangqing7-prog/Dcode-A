import type { AIConfig } from '../types/models';

export interface ChatRequest {
  prompt: string;
  stream?: boolean;
}

export interface AIService {
  generate(req: ChatRequest): Promise<string>;
  generateStream(req: ChatRequest, onToken: (token: string) => void): Promise<string>;
}

export abstract class BaseAIService implements AIService {
  constructor(protected config: AIConfig) {}
  abstract generate(req: ChatRequest): Promise<string>;
  abstract generateStream(req: ChatRequest, onToken: (token: string) => void): Promise<string>;

  protected headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`
    };
  }
}

export class OpenAIAdapter extends BaseAIService {
  async generate(req: ChatRequest): Promise<string> {
    const res = await fetch(`${this.config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        model: this.config.model,
        temperature: this.config.temperature,
        stream: false,
        messages: [{ role: 'user', content: req.prompt }]
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  async generateStream(req: ChatRequest, onToken: (token: string) => void): Promise<string> {
    const res = await fetch(`${this.config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        model: this.config.model,
        temperature: this.config.temperature,
        stream: true,
        messages: [{ role: 'user', content: req.prompt }]
      })
    });
    if (!res.body) return '';
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let output = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      output += chunk;
      onToken(chunk);
    }
    return output;
  }
}
