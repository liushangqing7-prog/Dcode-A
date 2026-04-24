<template>
  <section class="panel center">
    <div class="editor-grid" :class="{ split }">
      <Codemirror v-model="draft" :extensions="extensions" class="editor" @update:model-value="onChange" />
      <article v-if="split" class="preview" v-html="html"></article>
    </div>
    <footer class="status-bar">
      字数 {{ charCount }} · 段落 {{ paragraphCount }} · 阅读约 {{ readMinutes }} 分钟
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { renderMarkdown } from '../../utils/markdown-helper';
import { estimateReadingMinutes } from '../../utils/token-counter';

const props = defineProps<{ modelValue: string; split: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const draft = ref(props.modelValue);
const extensions = [markdown()];

watch(
  () => props.modelValue,
  (value) => {
    if (value !== draft.value) draft.value = value;
  }
);

const html = computed(() => renderMarkdown(draft.value));
const charCount = computed(() => draft.value.length);
const paragraphCount = computed(() => draft.value.split(/\n\s*\n/).filter(Boolean).length);
const readMinutes = computed(() => estimateReadingMinutes(draft.value));

const onChange = (value: string) => emit('update:modelValue', value);
</script>

<style scoped>
.panel.center { flex: 1; display: flex; flex-direction: column; }
.editor-grid { display: grid; grid-template-columns: 1fr; height: calc(100vh - 120px); }
.editor-grid.split { grid-template-columns: 1fr 1fr; gap: 8px; }
.editor,.preview { background: #151515; color: #ddd; border: 1px solid #333; border-radius: 8px; overflow: auto; }
.status-bar { margin-top: 8px; color: #8e9bb7; font-size: 12px; }
</style>
