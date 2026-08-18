import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/graph', label: '知识图谱' },
  { path: '/tools', label: '工具库' },
  { path: '/workshop', label: '交互工坊' },
  { path: '/learn', label: '学习路径' },
  { path: '/recommend', label: '智能推荐' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isEmbedded = searchParams.get('embedded') === 'true'

  // In embedded mode, show minimal chrome
  if (isEmbedded) {
    return (
      <div className="min-h-screen flex flex-col bg-mckinsey-light">
        {/* Compact tab nav for embedded mode */}
        <nav className="sticky top-0 z-50 bg-white border-b border-mckinsey-border px-4 py-2 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path + '?embedded=true'}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-mckinsey-teal/10 text-mckinsey-teal'
                    : 'text-mckinsey-muted hover:text-mckinsey-navy hover:bg-mckinsey-light'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-mckinsey-light">
      {/* Top Navigation - matches ai-quality-portal Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-mckinsey-border/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mckinsey-teal to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
              QT
            </div>
            <span className="font-semibold text-mckinsey-navy hidden sm:block">
              质量工具箱
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-mckinsey-navy border-b-2 border-mckinsey-teal'
                      : 'text-mckinsey-muted hover:text-mckinsey-navy'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-mckinsey-teal rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Back to main portal */}
          <a
            href="/methodology"
            className="text-xs text-mckinsey-muted hover:text-mckinsey-navy transition-colors"
          >
            ← 返回主站
          </a>
        </nav>

        {/* Mobile Nav */}
        <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1 border-t border-mckinsey-border/30">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-mckinsey-teal/10 text-mckinsey-teal'
                    : 'text-mckinsey-muted hover:text-mckinsey-navy'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-mckinsey-border py-8 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <p className="text-sm text-mckinsey-muted">
            Quality Toolbox © 2026 — 基于《质量工具箱》第三版 (Nancy R. Tague)
          </p>
          <p className="mt-1 text-xs text-mckinsey-muted/60">
            AI Quality Portal · DMAIC · Six Sigma · Continuous Improvement
          </p>
        </div>
      </footer>
    </div>
  )
}
