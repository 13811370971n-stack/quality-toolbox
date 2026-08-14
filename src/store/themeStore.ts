import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: (() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('quality-toolbox-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })(),
  toggle: () =>
    set((state) => {
      const next = !state.isDark
      localStorage.setItem('quality-toolbox-theme', next ? 'dark' : 'light')
      return { isDark: next }
    }),
}))
