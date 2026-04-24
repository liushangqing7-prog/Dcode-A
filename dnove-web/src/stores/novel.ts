import { defineStore } from 'pinia';
import { diffLines } from 'diff';
import type { Chapter, Novel, Snapshot } from '../types/models';
import { useWorkspaceStore } from './workspace';

export const useNovelStore = defineStore('novel', {
  state: () => ({
    currentNovel: null as Novel | null,
    currentChapterId: '' as string,
    snapshots: [] as Snapshot[]
  }),
  getters: {
    currentChapter(state): Chapter | undefined {
      return state.currentNovel?.chapters.find((c) => c.id === state.currentChapterId);
    }
  },
  actions: {
    setNovel(novel: Novel) {
      this.currentNovel = novel;
      this.currentChapterId = novel.chapters[0]?.id ?? '';
    },
    setChapter(chapterId: string) {
      this.currentChapterId = chapterId;
    },
    async updateCurrentChapter(content: string) {
      if (!this.currentNovel) return;
      const chapter = this.currentNovel.chapters.find((c) => c.id === this.currentChapterId);
      if (!chapter) return;
      chapter.content = content;
      chapter.updatedAt = new Date().toISOString();
      this.currentNovel.updatedAt = chapter.updatedAt;
      await useWorkspaceStore().saveNovel(this.currentNovel);
    },
    createSnapshot(label: string) {
      if (!this.currentNovel) return;
      this.snapshots.unshift({
        id: crypto.randomUUID(),
        novelId: this.currentNovel.id,
        label,
        content: JSON.stringify(this.currentNovel),
        settingsState: JSON.stringify({ characters: this.currentNovel.characters, world: this.currentNovel.worldSettings }),
        createdAt: new Date().toISOString()
      });
    },
    rollback(snapshotId: string) {
      const snap = this.snapshots.find((s) => s.id === snapshotId);
      if (!snap) return;
      this.currentNovel = JSON.parse(snap.content) as Novel;
    },
    compareWithSnapshot(snapshotId: string) {
      if (!this.currentNovel) return [];
      const snap = this.snapshots.find((s) => s.id === snapshotId);
      if (!snap) return [];
      return diffLines(snap.content, JSON.stringify(this.currentNovel, null, 2));
    }
  }
});
