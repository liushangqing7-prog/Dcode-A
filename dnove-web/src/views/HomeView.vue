<template>
  <main class="page">
    <h1>DNove Web</h1>
    <p>离线优先小说创作辅助工具</p>
    <button @click="openWorkspace">打开工作区</button>
    <button @click="showModal = true">一句话创世</button>
    <ul>
      <li v-for="novel in workspace.novels" :key="novel.id">
        <RouterLink :to="`/editor/${novel.id}`">{{ novel.title }}</RouterLink>
      </li>
    </ul>
    <NewIdeaModal :show="showModal" @close="showModal = false" @created="createFromIdea" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWorkspaceStore } from '../stores/workspace';
import { useRouter } from 'vue-router';
import NewIdeaModal from '../components/NewIdeaModal.vue';
import type { Novel } from '../types/models';

const workspace = useWorkspaceStore();
const router = useRouter();
const showModal = ref(false);

const openWorkspace = async () => {
  await workspace.openWorkspace();
};

const createFromIdea = async ({ title, json }: { title: string; json: string }) => {
  let parsed: Partial<Novel> = {};
  try { parsed = JSON.parse(json); } catch { parsed = {}; }
  const novel: Novel = {
    id: crypto.randomUUID(),
    title,
    description: String(parsed.description ?? ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: [{ id: crypto.randomUUID(), title: '第1章', content: '', summary: '', order: 0, updatedAt: new Date().toISOString() }],
    characters: (parsed.characters as any[]) ?? [],
    worldSettings: (parsed.worldSettings as any[]) ?? [],
    outline: [],
    tags: []
  };
  await workspace.saveNovel(novel);
  showModal.value = false;
  router.push(`/editor/${novel.id}`);
};
</script>
