import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'admin';
}

interface AdminStore {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  setAdmin: (admin: AdminUser) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      setAdmin: (admin) => set({ isAuthenticated: true, admin }),
      logout: () => set({ isAuthenticated: false, admin: null }),
    }),
    {
      name: 'admin-store',
    }
  )
);
