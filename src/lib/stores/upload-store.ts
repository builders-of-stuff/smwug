import { writable } from 'svelte/store';

export const uploadStore = writable({
  isUploading: false,
  error: null as string | null
});
