import { storeToRefs } from 'pinia';
import { useWorkspaceStore } from '../stores/workspace';

export function useWorkSpace() {
  const store = useWorkspaceStore();
  const refs = storeToRefs(store);
  return { ...store, ...refs };
}
