import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EditorView from '../views/EditorView.vue';
import SettingsView from '../views/SettingsView.vue';

export const router = createRouter({
  // Hash mode avoids 404 on direct open/refresh in GitHub Pages.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/editor/:id', component: EditorView },
    { path: '/settings', component: SettingsView }
  ]
});
