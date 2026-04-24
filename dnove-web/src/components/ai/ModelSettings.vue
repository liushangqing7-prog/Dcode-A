<template>
  <form class="settings" @submit.prevent="save">
    <input v-model="local.endpoint" placeholder="Endpoint" />
    <input v-model="local.apiKey" type="password" placeholder="API Key" />
    <input v-model="local.model" placeholder="Model" />
    <input v-model.number="local.temperature" type="number" min="0" max="2" step="0.1" />
    <button>保存 AI 设置</button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { AIConfig } from '../../types/models';

const props = defineProps<{ modelValue: AIConfig }>();
const emit = defineEmits<{ 'update:modelValue': [value: AIConfig] }>();
const local = reactive({ ...props.modelValue });
watch(() => props.modelValue, (next) => Object.assign(local, next));
const save = () => emit('update:modelValue', { ...local });
</script>
