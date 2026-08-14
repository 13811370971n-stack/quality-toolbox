import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { dmaicPhases } from '../data/dmaicPhases'

const features = [
  { icon: '🗺️', title: 'DMAIC 知识图谱', desc: '可视化展示各阶段工具分布与关联', link: '/graph' },
  { icon: '⚒️', title: '交互式工坊', desc: '7大基本工具在线交互使用', link: '/workshop' },
  { icon: '📚', title: '学习路径', desc: '自学 · 引导式 · 项目实战三种模式', link: '/learn' },
  { icon: '🎯', title: '智能推荐', desc: '描述问题，推荐最适合的质量工具', link: '/recommend' },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Quality Toolbox
          </span>
        </h1>
        <p className="text-xl text-surface-700 dark:text-surface-200 mb-2">
          质量工具箱 · 交互式学习平台
        </p>
        <p className="text-surface-700/70 dark:text-surface-200/50 max-w-2xl mx-auto">
          基于《The Quality Toolbox》第三版，以 DMAIC 框架组织 150+ 质量工具。
          支持在线交互使用、知识图谱导航和结构化学习路径。
        </p>
      </motion.section>

      {/* DMAIC Phase Cards */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">DMAIC 方法论</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {dmaicPhases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/graph?phase=${phase.id}`}
                className="block p-4 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/5 group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: phase.color + '20', color: phase.color }}
                >
                  {phase.icon}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: phase.color }}
                >
                  {phase.id} · {phase.name}
                </div>
                <div className="text-sm font-medium">{phase.nameZh}</div>
                <div className="text-xs text-surface-700/60 dark:text-surface-200/40 mt-1">
                  {phase.tools.length} 个工具
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">平台功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Link
                to={feat.link}
                className="block p-6 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/5 h-full"
              >
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="font-semibold mb-1">{feat.title}</h3>
                <p className="text-sm text-surface-700/70 dark:text-surface-200/50">
                  {feat.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-700/10 border border-primary-200 dark:border-primary-800"
      >
        <h2 className="text-xl font-semibold mb-2">快速开始</h2>
        <p className="text-surface-700/70 dark:text-surface-200/50 mb-4">
          描述你遇到的质量问题，AI 将推荐最适合的工具
        </p>
        <Link
          to="/recommend"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-lg shadow-primary-600/25"
        >
          🎯 开始使用智能推荐
        </Link>
      </motion.section>
    </div>
  )
}
