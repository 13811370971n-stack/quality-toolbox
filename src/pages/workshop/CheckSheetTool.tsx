import { useState } from 'react'
import { motion } from 'framer-motion'

interface Row {
  id: string
  label: string
  counts: number[]
}

export default function CheckSheetTool() {
  const [title, setTitle] = useState('缺陷检查表')
  const [columns, setColumns] = useState(['周一', '周二', '周三', '周四', '周五'])
  const [rows, setRows] = useState<Row[]>([
    { id: '1', label: '划伤', counts: [0, 0, 0, 0, 0] },
    { id: '2', label: '凹坑', counts: [0, 0, 0, 0, 0] },
    { id: '3', label: '色差', counts: [0, 0, 0, 0, 0] },
    { id: '4', label: '变形', counts: [0, 0, 0, 0, 0] },
  ])

  const increment = (rowIdx: number, colIdx: number) => {
    const updated = [...rows]
    updated[rowIdx] = {
      ...updated[rowIdx],
      counts: updated[rowIdx].counts.map((c, i) => (i === colIdx ? c + 1 : c)),
    }
    setRows(updated)
  }

  const decrement = (rowIdx: number, colIdx: number) => {
    const updated = [...rows]
    updated[rowIdx] = {
      ...updated[rowIdx],
      counts: updated[rowIdx].counts.map((c, i) => (i === colIdx ? Math.max(0, c - 1) : c)),
    }
    setRows(updated)
  }

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), label: '新类别', counts: columns.map(() => 0) }])
  }

  const addColumn = () => {
    setColumns([...columns, `列${columns.length + 1}`])
    setRows(rows.map((r) => ({ ...r, counts: [...r.counts, 0] })))
  }

  const removeRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx))
  }

  const rowTotals = rows.map((r) => r.counts.reduce((a, b) => a + b, 0))
  const colTotals = columns.map((_, ci) => rows.reduce((sum, r) => sum + r.counts[ci], 0))
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0)

  const resetAll = () => {
    setRows(rows.map((r) => ({ ...r, counts: r.counts.map(() => 0) })))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">☑️ 检查表</h1>
          <p className="text-sm text-surface-700/60 dark:text-surface-200/40">
            点击单元格计数，自动汇总统计
          </p>
        </div>
        <button
          onClick={resetAll}
          className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          🗑️ 清零
        </button>
      </div>

      {/* Title */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold px-3 py-1 rounded border border-transparent hover:border-surface-200 dark:hover:border-surface-800 bg-transparent focus:outline-none focus:border-primary-500 w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-800 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-100 dark:bg-surface-800">
              <th className="px-4 py-3 text-left font-medium">缺陷类别</th>
              {columns.map((col, ci) => (
                <th key={ci} className="px-4 py-3 text-center font-medium min-w-[80px]">
                  <input
                    type="text"
                    value={col}
                    onChange={(e) => {
                      const updated = [...columns]
                      updated[ci] = e.target.value
                      setColumns(updated)
                    }}
                    className="w-full text-center bg-transparent border-none focus:outline-none font-medium"
                  />
                </th>
              ))}
              <th className="px-4 py-3 text-center font-bold">合计</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-surface-200 dark:border-surface-800"
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => {
                        const updated = [...rows]
                        updated[ri] = { ...updated[ri], label: e.target.value }
                        setRows(updated)
                      }}
                      className="bg-transparent border-none focus:outline-none w-full"
                    />
                    <button
                      onClick={() => removeRow(ri)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </td>
                {row.counts.map((count, ci) => (
                  <td key={ci} className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => decrement(ri, ci)}
                        className="w-6 h-6 rounded text-xs bg-surface-100 dark:bg-surface-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => increment(ri, ci)}
                        className="w-10 h-8 rounded font-mono text-sm font-bold bg-surface-50 dark:bg-surface-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition cursor-pointer"
                      >
                        {count}
                      </button>
                      <button
                        onClick={() => increment(ri, ci)}
                        className="w-6 h-6 rounded text-xs bg-surface-100 dark:bg-surface-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                      >
                        +
                      </button>
                    </div>
                  </td>
                ))}
                <td className="px-4 py-2 text-center font-bold text-primary-600 dark:text-primary-400">
                  {rowTotals[ri]}
                </td>
              </motion.tr>
            ))}
            {/* Column totals */}
            <tr className="border-t-2 border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30">
              <td className="px-4 py-3 font-bold">合计</td>
              {colTotals.map((total, ci) => (
                <td key={ci} className="px-4 py-3 text-center font-bold">
                  {total}
                </td>
              ))}
              <td className="px-4 py-3 text-center font-bold text-primary-600 dark:text-primary-400 text-lg">
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={addRow}
          className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-800 text-sm hover:border-primary-300 dark:hover:border-primary-700 transition"
        >
          + 添加行
        </button>
        <button
          onClick={addColumn}
          className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-800 text-sm hover:border-primary-300 dark:hover:border-primary-700 transition"
        >
          + 添加列
        </button>
      </div>

      {/* Summary stats */}
      {grandTotal > 0 && (
        <div className="mt-8 p-4 rounded-xl border border-surface-200 dark:border-surface-800">
          <h3 className="font-semibold mb-3">📊 数据摘要</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{grandTotal}</div>
              <div className="text-xs text-surface-700/60 dark:text-surface-200/40">总计数</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{rows.length}</div>
              <div className="text-xs text-surface-700/60 dark:text-surface-200/40">缺陷类别</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{columns.length}</div>
              <div className="text-xs text-surface-700/60 dark:text-surface-200/40">时间段</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {rows.length > 0 ? rows[rowTotals.indexOf(Math.max(...rowTotals))].label : '-'}
              </div>
              <div className="text-xs text-surface-700/60 dark:text-surface-200/40">最多缺陷类型</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
