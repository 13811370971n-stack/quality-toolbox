# AI Quality Toolbox - 开发经验总结

## 项目概述

将《质量工具箱》(The Quality Toolbox, 3rd Edition) 中的 150+ 质量工具以交互式 Web 平台呈现，并通过 AI（DeepSeek）增强核心工具的智能化水平。

**线上地址：** http://8.146.227.10:8080/tools

---

## 架构演进

### Phase 1: 独立 SPA
- 技术栈：Vite + React 18 + TypeScript + Tailwind CSS + D3.js
- 部署：Nginx 静态文件 serve，独立端口
- 问题：与主站体验割裂（不同导航、不同风格）

### Phase 2: iframe 嵌入（方案 D）
- 主站 `/tools/quality-toolbox` 通过 iframe 嵌入独立 SPA
- 质量工具箱支持 `?embedded=true` 隐藏导航
- 问题：iframe 嵌套体验不完美，URL 不同步

### Phase 3: 深度整合（方案 C）
- 将所有组件迁移到 Next.js 项目中
- 使用 `dynamic(() => import(...), { ssr: false })` 解决 D3.js 的 SSR 问题
- 共享主站导航、认证、主题系统

### Phase 4: AI 增强
- 后端新增 `/api/v1/ai/*` 端点
- 通过 DeepSeek API 实现智能分析
- 混合模式：AI 可用时调用 DeepSeek，失败时退化为本地知识库

**最终架构：**
```
用户浏览器
  → Next.js (端口 3000, Nginx 代理 8080)
    → 页面: /tools (AI工具集，所有工具平级展示)
    → 页面: /tools/quality-toolbox/workshop/* (交互式工具)
    → 页面: /tools/quality-toolbox/[id] (工具详情)
  → FastAPI (端口 8000, Nginx 代理 /api/)
    → /api/v1/ai/fishbone/* (AI鱼骨图)
    → /api/v1/ai/five-whys/* (AI 5 Whys)
    → /api/v1/ai/pareto/* (AI帕累托)
    → DeepSeek API (外部)
    → 本地知识库 (fallback)
```

---

## 技术决策与经验教训

### 1. TypeScript 严格模式兼容
**问题：** Next.js 项目 tsconfig 的 `target` 低于 ES2015，导致 `[...new Set()]` 和 `Map.entries()` 报错。

**解决：** 使用 `Array.from(new Set(...))` 和 `Array.from(map.entries())` 替代 spread 语法。比修改 tsconfig 更安全（不影响其他代码）。

### 2. D3.js + Next.js SSR
**问题：** D3 依赖 DOM API，在 Node.js 服务端渲染时报错。

**解决：**
```tsx
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false });
```

### 3. AI API 设计 — 结构化输出
**关键：** Prompt 中要求 AI 返回固定 JSON 格式 + `response_format: { type: "json_object" }`。

**Fallback 策略：**
```python
result = await call_deepseek_json(system_prompt, user_message)
if not result["success"]:
    return get_fallback_from_knowledge_base(problem)
```

### 4. 前端 AI 交互模式
**原则：** AI 是助手不是替代。
- AI 生成内容始终可编辑/删除
- 标注"✨ AI建议"让用户知道来源
- 用户可选择采纳或忽略 AI 建议
- Loading 状态明确（"🤖 AI 分析中..."）

### 5. 多阶段部署策略
**经验：** 对于前后端分离项目，部署顺序很重要。
1. 先部署后端（API 可用）
2. 再构建前端（前端调用 API 时不会 404）
3. 最后重启前端服务

### 6. Nginx 权限问题
**问题：** Nginx worker (www-data) 无法访问 `/root/` 目录下的静态文件。

**解决：** `chmod 755 /root` + `chmod -R 755 /root/Projects/*/dist`

### 7. 部署自动化
**模式：** 所有部署通过 Python + paramiko 脚本执行。
- 凭证加密存储在 `~/.credentials/vault.enc`
- 脚本模板：SSH连接 → SFTP上传 → 远程执行命令 → 验证

---

## 工具实现清单

### 已实现（17个工具，10个可交互，3个AI增强）

| 工具 | 类型 | AI |
|------|------|-----|
| 因果图（鱼骨图）| ⚒️ 交互 | ✅ AI生成原因 + 展开子原因 |
| 5个为什么 | ⚒️ 交互 | ✅ AI建议 + 分叉 + 验证 + 措施 |
| 帕累托图 | ⚒️ 交互 | ✅ AI解读 + 对话 + 前后对比 |
| 检查表 | ⚒️ 交互 | - |
| 控制图 | ⚒️ 交互 | (AI-SPC 独立工具) |
| 直方图 | ⚒️ 交互 | - |
| 散点图 | ⚒️ 交互 | - |
| 流程图 | ⚒️ 交互 | - |
| FMEA | ⚒️ 交互 | - (待按AIAG/VDA标准开发) |
| SIPOC | ⚒️ 交互 | - |
| 亲和图 | 📖 详情 | - |
| 关联图 | 📖 详情 | - |
| 树图 | 📖 详情 | - |
| 矩阵图 | 📖 详情 | - |
| 矩阵数据分析 | 📖 详情 | - |
| PDPC | 📖 详情 | - |
| 箭线图 | 📖 详情 | - |

### AI 后端 API

| Endpoint | 功能 |
|----------|------|
| `GET /api/v1/ai/health` | 服务状态 |
| `POST /api/v1/ai/fishbone/generate` | 生成6M原因 |
| `POST /api/v1/ai/fishbone/expand` | 展开子原因 |
| `POST /api/v1/ai/five-whys/suggest` | 建议追问方向 |
| `POST /api/v1/ai/five-whys/validate` | 验证根因+建议措施 |
| `POST /api/v1/ai/pareto/analyze` | 数据解读 |
| `POST /api/v1/ai/pareto/chat` | 对话追问 |
| `POST /api/v1/ai/pareto/compare` | 前后对比分析 |

---

## 下一步计划

### 短期（P1）
- [ ] AI-FMEA：按 AIAG/VDA 标准开发，分 DFMEA 和 PFMEA
- [ ] 更多工具 AI 化：直方图（自动诊断分布）、散点图（自动识别相关）
- [ ] 用户数据持久化（当前 localStorage，需迁移到后端）

### 中期（P2）
- [ ] 补全 P1 优先级工具（统计分析8个 + 客户需求6个）
- [ ] 工具间联动（如帕累托追问自动跳转鱼骨图）
- [ ] 导出功能（PNG/PDF/Excel）

### 长期（P3）
- [ ] 全部 150+ 工具录入
- [ ] AI 教练模式集成（引导用户在项目中选择工具）
- [ ] 多语言支持
- [ ] 企业版功能（团队协作、项目管理、数据看板）

---

## 关键文件位置

```
ai-quality-portal/
├── backend/
│   ├── app/main.py                          # FastAPI 入口
│   ├── app/api/v1/ai.py                     # AI API 路由
│   ├── app/services/deepseek.py             # DeepSeek 客户端
│   └── app/services/fallback_knowledge.py   # 本地知识库
├── frontend/
│   ├── src/pages/tools/index.tsx            # AI工具集页面
│   ├── src/pages/tools/quality-toolbox/     # 质量工具箱页面
│   │   ├── index.tsx                        # 首页
│   │   ├── workshop/*/index.tsx             # 各交互工具页面
│   │   ├── graph/                           # 知识图谱
│   │   ├── learn/                           # 学习路径
│   │   └── [id]/                            # 工具详情
│   └── src/components/quality-toolbox/
│       ├── data/tools.ts                    # 工具数据（17个）
│       ├── data/dmaicPhases.ts              # DMAIC阶段映射
│       ├── hooks/useTools.ts                # 数据访问hooks
│       ├── workshop/FishboneTool.tsx         # AI-鱼骨图组件
│       ├── workshop/FiveWhysTool.tsx         # AI-5Whys组件
│       ├── workshop/ParetoTool.tsx           # AI-帕累托组件
│       └── ...                              # 其他工具组件

quality-toolbox/  (独立仓库，保留原始SPA代码作为参考)
├── src/
├── package.json
└── README.md
```

---

## 团队与致谢

- 质量工具内容来源：《The Quality Toolbox, 3rd Edition》Nancy R. Tague (ASQ Quality Press)
- AI 能力：DeepSeek API
- 设计语言：McKinsey-inspired palette（Navy #051C2C, Teal #00A0AF, Gold #C5A572）
