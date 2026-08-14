# Quality Toolbox - 质量工具箱

交互式质量工具学习平台，基于《The Quality Toolbox》第三版 (Nancy R. Tague)。

## 功能

- 🗺️ **DMAIC 知识图谱** — 可视化展示各阶段工具分布与关联
- ⚒️ **交互式工坊** — 7大基本质量工具在线交互使用
- 📚 **学习路径** — 自学 · 引导式 · 项目实战三种模式
- 🎯 **智能推荐** — 描述问题，推荐最适合的质量工具

## 交互式工具

| 工具 | 功能 |
|------|------|
| 🐟 鱼骨图 | 在线创建因果分析图，支持6M分类 |
| ☑️ 检查表 | 可自定义的数据收集表格，点击计数 |
| 📈 控制图 | I-MR / X̄-R 图，自动计算控制限 |
| 📊 直方图 | 自动分组，叠加正态曲线，计算Cp/Cpk |
| 📉 帕累托图 | 自动排序，标注80%线 |
| ⚡ 散点图 | 相关分析，回归方程，相关系数 |
| 🔀 流程图 | 标准符号，双击编辑 |

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- D3.js
- Zustand

## 本地开发

```bash
bun install
bun run dev
```

## 构建部署

```bash
bun run build
```

构建产物在 `dist/` 目录，可直接部署为静态站点。

## 部署

部署到阿里云服务器，通过 Nginx 提供服务。
域名：aidmaic.top

## License

MIT
