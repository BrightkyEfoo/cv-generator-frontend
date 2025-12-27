import { create } from 'zustand';
import type { CV } from '@/types/cv';

interface CVStore {
  cv: CV | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  setCV: (cv: CV) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  clearCV: () => void;
}

export const useCVStore = create<CVStore>((set) => ({
  cv: null,
  isLoading: false,
  isSaving: false,
  error: null,
  setCV: (cv) => set({ cv, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),
  clearCV: () => set({ cv: null, error: null }),
}));
