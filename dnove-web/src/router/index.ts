import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EditorView from '../views/EditorView.vue';
import SettingsView from '../views/SettingsView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/editor/:id', component: EditorView },
    { path: '/settings', component: SettingsView }
  ]
});
