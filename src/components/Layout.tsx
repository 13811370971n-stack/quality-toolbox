import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useThemeStore } from '../store/themeStore'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/graph', label: '知识图谱', icon: '🗺️' },
  { path: '/tools', label: '工具库', icon: '🧰' },
  { path: '/workshop', label: '交互工坊', icon: '⚒️' },
  { path: '/learn', label: '学习路径', icon: '📚' },
  { path: '/recommend', label: '智能推荐', icon: '🎯' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggle } = useThemeStore()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                QT
              </div>
              <span className="font-semibold text-lg hidden sm:block">
                Quality Toolbox
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-surface-700 dark:text-surface-200 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.span
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="text-xl block"
              >
                {isDark ? '🌙' : '☀️'}
              </motion.span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-surface-700 dark:text-surface-200">
          <p>Quality Toolbox © 2026 — 基于《质量工具箱》第三版 (Nancy R. Tague)</p>
          <p className="mt-1 text-surface-700/60 dark:text-surface-200/40">
            DMAIC · Six Sigma · Continuous Improvement
          </p>
        </div>
      </footer>
    </div>
  )
}
