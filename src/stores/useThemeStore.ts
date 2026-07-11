import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  // Defaults to 'dark' if no theme is stored in localStorage
  theme: typeof window !== 'undefined' && localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      document.documentElement.classList.toggle('light', nextTheme === 'light');
      return { theme: nextTheme };
    });
  },
}));
