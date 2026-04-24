<template>
  <aside class="panel right">
    <header>
      <h3>AI 草案区</h3>
      <button @click="$emit('generate')">生成</button>
    </header>
    <DraftArea :drafts="drafts" @adopt="$emit('adopt', $event)" @discard="$emit('discard', $event)" />
  </aside>
</template>

<script setup lang="ts">
import DraftArea from '../ai/DraftArea.vue';
import type { DraftItem } from '../../types/models';

defineProps<{ drafts: DraftItem[] }>();
defineEmits<{ adopt: [id: string]; discard: [id: string]; generate: [] }>();
</script>

<style scoped>
.panel.right { width: 320px; border-left: 1px solid #333; padding: 8px; overflow: auto; }
</style>
