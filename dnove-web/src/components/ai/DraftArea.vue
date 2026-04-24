<template>
  <div class="draft-area">
    <article v-for="d in drafts" :key="d.id" class="draft-card">
      <h4>{{ d.title }}</h4>
      <textarea v-model="d.content" rows="6"></textarea>
      <p class="meta">tokens: {{ d.tokens ?? '-' }} · ${{ (d.estimatedCost ?? 0).toFixed(4) }}</p>
      <div class="actions">
        <button @click="$emit('adopt', d.id)">采用</button>
        <button @click="$emit('discard', d.id)">丢弃</button>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { DraftItem } from '../../types/models';
defineProps<{ drafts: DraftItem[] }>();
defineEmits<{ adopt: [id: string]; discard: [id: string] }>();
</script>

<style scoped>
.draft-card { background: #1d1d1d; border: 1px solid #333; border-radius: 8px; padding: 8px; margin-bottom: 8px; }
textarea { width: 100%; background: #111; color: #ddd; border: 1px solid #333; }
.actions { display: flex; gap: 8px; }
.meta { color: #97a0b9; font-size: 12px; }
</style>
