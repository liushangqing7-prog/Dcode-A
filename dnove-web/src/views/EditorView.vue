<template>
  <main class="editor-page">
    <LeftPanel :visible="leftOpen" :chapters="novel?.chapters || []" :active-id="novelStore.currentChapterId" @select="novelStore.setChapter" @reorder="reorder" @toggle="leftOpen = false" />
    <CenterEditor :model-value="content" :split="settings.editorSplit" @update:model-value="updateContent" />
    <RightPanel :drafts="ai.drafts" @generate="generate" @adopt="adopt" @discard="ai.removeDraft" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import LeftPanel from '../components/layout/LeftPanel.vue';
import CenterEditor from '../components/layout/CenterEditor.vue';
import RightPanel from '../components/layout/RightPanel.vue';
import { useWorkspaceStore } from '../stores/workspace';
import { useNovelStore } from '../stores/novel';
import { useAIStore } from '../stores/ai';
import { useSettingsStore } from '../stores/settings';

const route = useRoute();
const workspace = useWorkspaceStore();
const novelStore = useNovelStore();
const ai = useAIStore();
const settings = useSettingsStore();
const leftOpen = ref(true);

const novel = computed(() => novelStore.currentNovel);
const content = computed(() => novelStore.currentChapter?.content ?? '');

watchEffect(() => {
  const target = workspace.novels.find((n) => n.id === route.params.id);
  if (target) novelStore.setNovel(target);
});

const updateContent = async (value: string) => {
  await novelStore.updateCurrentChapter(value);
};

const reorder = async (chapters: any[]) => {
  if (!novel.value) return;
  novel.value.chapters = chapters;
  await workspace.saveNovel(novel.value);
};

const generate = async () => {
  await ai.generateFromTemplate('continue', { selectedText: content.value }, 2);
};

const adopt = async (id: string) => {
  const draft = ai.drafts.find((d) => d.id === id);
  if (!draft) return;
  await novelStore.updateCurrentChapter(`${content.value}\n\n${draft.content}`);
  novelStore.createSnapshot('adopt-ai-draft');
  ai.removeDraft(id);
};
</script>

<style scoped>
.editor-page { display: flex; height: calc(100vh - 58px); background: #111; color: #ddd; }
</style>
