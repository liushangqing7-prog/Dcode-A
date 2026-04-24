<template>
  <aside class="panel left" v-show="visible">
    <header>
      <h3>大纲树</h3>
      <button @click="$emit('toggle')">收起</button>
    </header>
    <ul ref="listEl" class="outline-list">
      <li v-for="chapter in chapters" :key="chapter.id" @click="$emit('select', chapter.id)" :class="{ active: chapter.id === activeId }">
        {{ chapter.title }}
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs';
import { onMounted, ref } from 'vue';
import type { Chapter } from '../../types/models';

const props = defineProps<{ chapters: Chapter[]; activeId: string; visible: boolean }>();
const emit = defineEmits<{ select: [id: string]; reorder: [chapters: Chapter[]]; toggle: [] }>();
const listEl = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!listEl.value) return;
  Sortable.create(listEl.value, {
    animation: 150,
    onEnd(event) {
      const arr = [...props.chapters];
      const moved = arr.splice(event.oldIndex ?? 0, 1)[0];
      arr.splice(event.newIndex ?? 0, 0, moved);
      emit('reorder', arr.map((item, index) => ({ ...item, order: index })));
    }
  });
});
</script>

<style scoped>
.panel.left { width: 260px; border-right: 1px solid #333; padding: 8px; }
.outline-list { list-style: none; padding: 0; margin: 0; }
.outline-list li { padding: 6px 8px; border-radius: 6px; cursor: pointer; }
.outline-list li.active { background: #2f3a56; }
</style>
