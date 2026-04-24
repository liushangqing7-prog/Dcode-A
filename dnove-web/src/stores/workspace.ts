import { defineStore } from 'pinia';
import JSZip from 'jszip';
import { useFileSystem, type FileSystemAdapter } from '../composables/useFileSystem';
import type { Novel } from '../types/models';

interface WorkspaceState {
  adapter: FileSystemAdapter | null;
  currentWorkspaceName: string;
  novels: Novel[];
}

export const useWorkspaceStore = defineStore('workspace', {
  state: (): WorkspaceState => ({
    adapter: null,
    currentWorkspaceName: 'default-workspace',
    novels: []
  }),
  actions: {
    async openWorkspace() {
      const fs = useFileSystem();
      this.adapter = await fs.pickDirectory().catch(() => fs.fallback());
      await this.loadNovels();
    },

    async loadNovels() {
      if (!this.adapter) return;
      const paths = await this.adapter.listDirectory('workspace/');
      const novelJsonPaths = paths.filter((p) => p.endsWith('novel.json'));
      const loaded: Novel[] = [];
      for (const path of novelJsonPaths) {
        const content = await this.adapter.readFile(path);
        if (content) loaded.push(JSON.parse(content));
      }
      this.novels = loaded;
    },

    async saveNovel(novel: Novel) {
      if (!this.adapter) return;
      const base = `workspace/${novel.title}`;
      await this.adapter.saveFile(`${base}/novel.json`, JSON.stringify(novel, null, 2));
      this.novels = this.novels.filter((n) => n.id !== novel.id).concat(novel);
    },

    async exportWorkspaceZip(): Promise<Blob> {
      if (!this.adapter) throw new Error('Workspace not opened');
      const zip = new JSZip();
      const files = await this.adapter.listDirectory('');
      for (const path of files) {
        const content = await this.adapter.readFile(path);
        if (content !== null) zip.file(path, content);
      }
      return await zip.generateAsync({ type: 'blob' });
    },

    async importWorkspaceZip(file: File) {
      const fs = useFileSystem();
      this.adapter = this.adapter ?? fs.fallback();
      const zip = await JSZip.loadAsync(file);
      await Promise.all(
        Object.keys(zip.files).map(async (path) => {
          const entry = zip.files[path];
          if (!entry.dir) {
            await this.adapter!.saveFile(path, await entry.async('string'));
          }
        })
      );
      await this.loadNovels();
    }
  }
});
