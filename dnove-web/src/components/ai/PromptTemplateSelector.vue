<template>
  <label>
    模板
    <select v-model="selected" @change="$emit('update:modelValue', selected)">
      <option v-for="t in templates" :value="t.id" :key="t.id">{{ t.name }}</option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { PromptTemplate } from '../../types/models';

const props = defineProps<{ templates: PromptTemplate[]; modelValue: string }>();
const selected = ref(props.modelValue);
watchEffect(() => (selected.value = props.modelValue));
defineEmits<{ 'update:modelValue': [id: string] }>();
</script>
