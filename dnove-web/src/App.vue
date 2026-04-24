<template>
  <div class="app dark">
    <nav class="top-nav">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/settings">设置</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts"></script>

<style>
:root { color-scheme: dark; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #0f0f0f; }
.top-nav { display: flex; gap: 12px; padding: 12px; background: #161616; border-bottom: 1px solid #333; }
a { color: #9dc1ff; text-decoration: none; }
.page { color: #ddd; padding: 16px; }
button { background: #2f3a56; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer; }
input, select { background: #141414; color: #ddd; border: 1px solid #333; border-radius: 6px; padding: 6px; margin: 4px; }
</style>
