<template>
  <div v-if="show" class="mask">
    <div class="modal">
      <h3>一句话创世</h3>
      <textarea v-model="idea" rows="4" placeholder="输入一句脑洞"></textarea>
      <textarea v-model="generated" rows="8" placeholder="AI 生成草案(JSON)"></textarea>
      <div class="actions">
        <button @click="generate">AI 生成</button>
        <button @click="confirm">确认创建</button>
        <button @click="$emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAIStore } from '../stores/ai';

const emit = defineEmits<{ close: []; created: [payload: { title: string; json: string }] }>();
defineProps<{ show: boolean }>();
const ai = useAIStore();
const idea = ref('');
const generated = ref('');

const generate = async () => {
  const prompt = `把以下脑洞生成小说初始化 JSON（包含风格、冲突、角色雏形、关键节点）: ${idea.value}`;
  generated.value = await ai.service().generate({ prompt });
};

const confirm = () => {
  emit('created', { title: idea.value.slice(0, 20) || '新小说', json: generated.value });
};
</script>

<style scoped>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: grid; place-items: center; }
.modal { width: 680px; background: #1a1a1a; padding: 16px; border-radius: 10px; }
textarea { width: 100%; background: #111; color: #ddd; margin-bottom: 8px; }
.actions { display: flex; gap: 8px; }
</style>
