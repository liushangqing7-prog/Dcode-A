export interface Chapter {
  id: string;
  title: string;
  content: string;
  summary: string;
  order: number;
  updatedAt: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  traits: string[];
  currentState: Record<string, string>;
  status: 'draft' | 'confirmed';
  aiProposals: string[];
}

export interface WorldSetting {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'draft' | 'confirmed';
  aiProposals: string[];
}

export interface OutlineNode {
  id: string;
  title: string;
  type: 'volume' | 'chapter';
  children?: OutlineNode[];
}

export interface Snapshot {
  id: string;
  novelId: string;
  label: string;
  content: string;
  settingsState: string;
  createdAt: string;
}

export interface Novel {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  characters: Character[];
  worldSettings: WorldSetting[];
  outline: OutlineNode[];
  tags: string[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  description?: string;
}

export interface AIConfig {
  provider: 'openai' | 'deepseek' | 'qwen' | 'custom';
  endpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  monthlyBudget: number;
}

export interface DraftItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tokens?: number;
  estimatedCost?: number;
  selected: boolean;
}
