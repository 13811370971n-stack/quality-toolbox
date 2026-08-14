import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSearchTools, useCategories, useDmaicPhases } from '../hooks/useTools'
import { DmaicPhase } from '../types'

export default function ToolsPage() {
  const [query, setQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<DmaicPhase | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const allTools = useSearchTools(query)
  const categories = useCategories()
  const phases = useDmaicPhases()

  const filtered = allTools.filter((t) => {
    if (phaseFilter && !t.dmaic.includes(phaseFilter)) return false
    if (categoryFilter && t.category !== categoryFilter) return false
    return true
  })

  const difficultyColor = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  const difficultyLabel = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">🧰 工具库</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="搜索工具名称、描述..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-mckinsey-border bg-white focus:outline-none focus:ring-2 focus:ring-mckinsey-teal transition"
        />
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value as DmaicPhase | '')}
          className="px-4 py-2.5 rounded-lg border border-mckinsey-border bg-white focus:outline-none focus:ring-2 focus:ring-mckinsey-teal"
        >
          <option value="">所有阶段</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} - {p.nameZh}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-mckinsey-border bg-white focus:outline-none focus:ring-2 focus:ring-mckinsey-teal"
        >
          <option value="">所有类别</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-mckinsey-muted mb-4">
        显示 {filtered.length} 个工具
      </p>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/tools/${tool.id}`}
              className="block p-5 rounded-xl border border-mckinsey-border hover:border-mckinsey-teal/30 transition-all hover:shadow-lg hover:shadow-mckinsey-teal/5 h-full group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold group-hover:text-mckinsey-teal transition-colors">
                  {tool.nameZh}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[tool.difficulty]}`}>
                  {difficultyLabel[tool.difficulty]}
                </span>
              </div>
              <p className="text-xs text-mckinsey-muted mb-2 font-mono">
                {tool.name}
              </p>
              <p className="text-sm text-mckinsey-muted line-clamp-2 mb-3">
                {tool.descriptionZh}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {tool.dmaic.map((phase) => {
                  const phaseInfo = phases.find((p) => p.id === phase)
                  return (
                    <span
                      key={phase}
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        backgroundColor: (phaseInfo?.color || '#666') + '20',
                        color: phaseInfo?.color || '#666',
                      }}
                    >
                      {phase}
                    </span>
                  )
                })}
                {tool.hasInteractive && (
                  <span className="text-xs px-2 py-0.5 rounded bg-mckinsey-teal/10 text-mckinsey-teal">
                    ⚒️ 可交互
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
