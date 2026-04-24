import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    darkMode: true,
    focusMode: false,
    editorSplit: true
  }),
  actions: {
    load() {
      const raw = localStorage.getItem('dnove-settings');
      if (raw) Object.assign(this, JSON.parse(raw));
    },
    save() {
      localStorage.setItem('dnove-settings', JSON.stringify({
        darkMode: this.darkMode,
        focusMode: this.focusMode,
        editorSplit: this.editorSplit
      }));
    }
  }
});
