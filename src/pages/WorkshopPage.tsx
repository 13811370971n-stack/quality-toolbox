import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tools } from '../data/tools'

export default function WorkshopPage() {
  const interactiveTools = tools.filter((t) => t.hasInteractive)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">⚒️ 交互工坊</h1>
      <p className="text-surface-700/60 dark:text-surface-200/40 mb-8">
        在线使用七大基本质量工具。输入你的数据，即时生成分析结果。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {interactiveTools.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={tool.interactivePath!}
              className="block p-6 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/10 group h-full"
            >
              <div className="text-3xl mb-3">
                {tool.id === 'cause-effect-diagram' && '🐟'}
                {tool.id === 'check-sheet' && '☑️'}
                {tool.id === 'control-chart' && '📈'}
                {tool.id === 'histogram' && '📊'}
                {tool.id === 'pareto-chart' && '📉'}
                {tool.id === 'scatter-diagram' && '⚡'}
                {tool.id === 'flowchart' && '🔀'}
              </div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.nameZh}
              </h3>
              <p className="text-sm text-surface-700/60 dark:text-surface-200/40 line-clamp-2">
                {tool.descriptionZh}
              </p>
              <div className="mt-4 text-sm text-primary-600 dark:text-primary-400 font-medium">
                打开工具 →
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
