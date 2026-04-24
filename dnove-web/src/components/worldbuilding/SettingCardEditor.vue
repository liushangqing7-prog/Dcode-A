<template>
  <section>
    <h3>设定卡</h3>
    <textarea v-model="content" rows="8"></textarea>
    <button @click="$emit('save', content)">保存设定</button>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{ modelValue: string }>();
const content = ref(props.modelValue);
watch(() => props.modelValue, (v) => (content.value = v));
defineEmits<{ save: [value: string] }>();
</script>
