<template>
  <main class="page">
    <h2>设置</h2>
    <ModelSettings :model-value="ai.config" @update:model-value="ai.saveConfig" />
    <label><input type="checkbox" v-model="settings.editorSplit" @change="settings.save" /> 编辑器分屏预览</label>
    <label><input type="checkbox" v-model="settings.focusMode" @change="settings.save" /> 专注模式</label>
  </main>
</template>

<script setup lang="ts">
import ModelSettings from '../components/ai/ModelSettings.vue';
import { useAIStore } from '../stores/ai';
import { useSettingsStore } from '../stores/settings';

const ai = useAIStore();
const settings = useSettingsStore();
</script>
