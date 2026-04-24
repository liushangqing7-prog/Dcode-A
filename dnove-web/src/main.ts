import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

createApp(App).use(createPinia()).use(router).mount('#app');
