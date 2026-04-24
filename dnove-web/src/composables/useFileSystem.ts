import Dexie, { type Table } from 'dexie';

interface FsEntry {
  path: string;
  content: string;
  updatedAt: string;
}

class WorkspaceDB extends Dexie {
  files!: Table<FsEntry, string>;
  constructor() {
    super('dnove-workspace-db');
    this.version(1).stores({ files: 'path,updatedAt' });
  }
}

const db = new WorkspaceDB();

export interface FileSystemAdapter {
  saveFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string | null>;
  listDirectory(prefix: string): Promise<string[]>;
  removeFile(path: string): Promise<void>;
}

class IndexedDbAdapter implements FileSystemAdapter {
  async saveFile(path: string, content: string): Promise<void> {
    await db.files.put({ path, content, updatedAt: new Date().toISOString() });
  }
  async readFile(path: string): Promise<string | null> {
    return (await db.files.get(path))?.content ?? null;
  }
  async listDirectory(prefix: string): Promise<string[]> {
    const rows = await db.files.filter((row) => row.path.startsWith(prefix)).toArray();
    return rows.map((row) => row.path);
  }
  async removeFile(path: string): Promise<void> {
    await db.files.delete(path);
  }
}

class NativeFsAdapter implements FileSystemAdapter {
  constructor(private root: FileSystemDirectoryHandle) {}

  private async resolve(path: string, create = false): Promise<{ dir: FileSystemDirectoryHandle; name: string }> {
    const parts = path.split('/').filter(Boolean);
    const name = parts.pop();
    if (!name) throw new Error('Invalid path');
    let dir = this.root;
    for (const p of parts) {
      dir = await dir.getDirectoryHandle(p, { create });
    }
    return { dir, name };
  }

  async saveFile(path: string, content: string): Promise<void> {
    const { dir, name } = await this.resolve(path, true);
    const file = await dir.getFileHandle(name, { create: true });
    const writable = await file.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async readFile(path: string): Promise<string | null> {
    try {
      const { dir, name } = await this.resolve(path, false);
      const file = await dir.getFileHandle(name);
      return await (await file.getFile()).text();
    } catch {
      return null;
    }
  }

  async listDirectory(prefix: string): Promise<string[]> {
    const paths: string[] = [];
    const walk = async (dir: FileSystemDirectoryHandle, current: string) => {
      for await (const [name, handle] of dir.entries()) {
        const next = current ? `${current}/${name}` : name;
        if (handle.kind === 'directory') await walk(handle, next);
        else if (next.startsWith(prefix)) paths.push(next);
      }
    };
    await walk(this.root, '');
    return paths;
  }

  async removeFile(path: string): Promise<void> {
    const { dir, name } = await this.resolve(path, false);
    await dir.removeEntry(name);
  }
}

export function useFileSystem() {
  const supported = 'showDirectoryPicker' in window;

  const pickDirectory = async (): Promise<FileSystemAdapter> => {
    if (!supported) return new IndexedDbAdapter();
    const handle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
    return new NativeFsAdapter(handle);
  };

  const fallback = (): FileSystemAdapter => new IndexedDbAdapter();

  return { supported, pickDirectory, fallback };
}
