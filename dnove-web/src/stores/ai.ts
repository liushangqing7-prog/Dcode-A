import { defineStore } from 'pinia';
import { OpenAIAdapter, type AIService } from '../services/aiService';
import type { AIConfig, DraftItem, PromptTemplate } from '../types/models';

const DEFAULT_CONFIG: AIConfig = {
  provider: 'openai',
  endpoint: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  monthlyBudget: 30
};

export const useAIStore = defineStore('ai', {
  state: () => ({
    config: { ...DEFAULT_CONFIG } as AIConfig,
    templates: [
      { id: 'continue', name: '续写', content: '请根据上下文续写：\n{{selectedText}}' },
      { id: 'expand', name: '扩写', content: '将以下文本扩写成更生动的段落：\n{{selectedText}}' }
    ] as PromptTemplate[],
    drafts: [] as DraftItem[],
    tokenUsage: 0,
    estimatedCost: 0
  }),
  actions: {
    loadConfig() {
      const raw = localStorage.getItem('dnove-ai-config');
      if (raw) this.config = JSON.parse(raw);
    },
    saveConfig(config: AIConfig) {
      this.config = config;
      localStorage.setItem('dnove-ai-config', JSON.stringify(config));
    },
    service(): AIService {
      return new OpenAIAdapter(this.config);
    },
    async generateFromTemplate(templateId: string, vars: Record<string, string>, parallel = 1) {
      const template = this.templates.find((t) => t.id === templateId);
      if (!template) throw new Error('Template missing');
      const prompt = template.content.replace(/{{(\w+)}}/g, (_, key) => vars[key] ?? '');
      const tasks = Array.from({ length: parallel }, async (_, i) => {
        const text = await this.service().generate({ prompt });
        const tokens = Math.ceil((prompt.length + text.length) / 4);
        const cost = tokens * 0.000002;
        this.tokenUsage += tokens;
        this.estimatedCost += cost;
        this.drafts.unshift({
          id: crypto.randomUUID(),
          title: `${template.name} 分支 ${i + 1}`,
          content: text,
          createdAt: new Date().toISOString(),
          selected: false,
          tokens,
          estimatedCost: cost
        });
      });
      await Promise.all(tasks);
    },
    removeDraft(id: string) {
      this.drafts = this.drafts.filter((d) => d.id !== id);
    }
  }
});
