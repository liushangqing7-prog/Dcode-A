import { ref } from 'vue';

interface VectorChunk {
  id: string;
  text: string;
  vector: number[];
}

export function useVectorStore() {
  const ready = ref(false);
  const chunks = ref<VectorChunk[]>([]);

  const init = async () => {
    // Placeholder for @xenova/transformers pipeline loading.
    ready.value = true;
  };

  const cosine = (a: number[], b: number[]) => {
    const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);
    const na = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const nb = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (na * nb || 1);
  };

  const upsertChunk = (entry: VectorChunk) => {
    const idx = chunks.value.findIndex((c) => c.id === entry.id);
    if (idx >= 0) chunks.value[idx] = entry;
    else chunks.value.push(entry);
  };

  const searchTopK = (queryVector: number[], k = 3) => {
    return [...chunks.value]
      .map((chunk) => ({ chunk, score: cosine(queryVector, chunk.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  };

  return { ready, init, upsertChunk, searchTopK };
}
