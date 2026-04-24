import { useAIStore } from '../stores/ai';

export function useAI() {
  const aiStore = useAIStore();
  return {
    ...aiStore,
    generateByTemplate: aiStore.generateFromTemplate
  };
}
