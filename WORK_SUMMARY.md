# AI Quality Portal - 工作总结 (2026-08-21)

## 项目状态

**线上地址：** http://8.146.227.10:8080/tools

---

## 已完成功能

### AI 工具（7个）
| 工具 | 状态 | 路径 |
|------|------|------|
| AI-SPC | ✅ 上线 | /tools/ai-spc |
| AI-DFMEA | ✅ 上线 | /tools/ai-dfmea |
| AI-PFMEA | ✅ 上线 | /tools/ai-pfmea |
| AI-鱼骨图 | ✅ 上线 | /tools/quality-toolbox/workshop/fishbone |
| AI-5 Whys | ✅ 上线 | /tools/quality-toolbox/workshop/five-whys |
| AI-帕累托图 | ✅ 上线 | /tools/quality-toolbox/workshop/pareto |
| AI-MSA | 🔜 即将推出 | — |
| AI-DOE | 🔜 即将推出 | — |
| AI-Hypothesis | 🔜 即将推出 | — |

### 质量工具箱（37个工具）
| 类别 | 数量 | 状态 |
|------|------|------|
| 七大基本工具 | 7 | ✅ 可交互 |
| 七大管理工具 | 7 | ✅ 详情页 |
| 核心补充 (5Whys/FMEA/SIPOC) | 3 | ✅ 可交互+AI |
| 统计分析工具 | 8 | ✅ 页面框架(待完善图表) |
| 客户需求工具 | 6 | ✅ 详情页 |
| 决策工具 | 6 | ✅ 详情页 |

### 平台功能
| 功能 | 状态 |
|------|------|
| AI工具集页面（所有工具平级卡片） | ✅ |
| 智能推荐搜索栏 | ✅ |
| 中文类别筛选 | ✅ |
| DMAIC知识图谱 | ✅ |
| 学习路径(3模式) | ✅ |
| McKinsey 统一设计风格 | ✅ |
| 方法论页面集成 | ✅ |

### 后端 API
| 模块 | Endpoints |
|------|-----------|
| AI Quality Tools | /api/v1/ai/fishbone/*, /api/v1/ai/five-whys/*, /api/v1/ai/pareto/* |
| AI FMEA | /api/v1/ai/fmea/ap, /api/v1/ai/fmea/standards/*, /api/v1/ai/fmea/failure-analysis, /api/v1/ai/fmea/optimize |
| Tools Registry | /api/v1/tools/ |
| Coach | /api/v1/coach/ |
| Methodology | /api/v1/methodology/ |

---

## 技术架构

```
用户 → Nginx (:8080) → Next.js (:3000) → 页面渲染
                      → FastAPI (:8000) → DeepSeek API / 本地知识库
```

---

## 待办事项

### 短期
- [ ] DFMEA/PFMEA Excel 导出功能实现
- [ ] 8个统计工具的完整D3交互图表
- [ ] UI布局优化（AI分析结果在图表下方滚动）
- [ ] 多窗口协作代码覆盖问题解决

### 中期
- [ ] 剩余 113 个工具逐步录入
- [ ] 工具间联动（帕累托→鱼骨图）
- [ ] 用户数据持久化（localStorage → 后端数据库）
- [ ] 进程管理（nohup → systemd/pm2）

### 长期
- [ ] AI-MSA, AI-DOE 开发
- [ ] 企业协作功能
- [ ] 多语言支持

---

## 多窗口代码覆盖问题

### 问题描述
在不同 Kiro 窗口中同时修改同一服务器上的文件，会导致互相覆盖。例如：
- 窗口A修改了 `tools/index.tsx` 并部署
- 窗口B不知道A的修改，读取了旧版本的 `tools/index.tsx`，修改后部署覆盖了A的更改

### 解决方案

#### 方案1: Git 作为真相来源（推荐）
所有修改先提交到 Git 仓库，服务器部署时从 Git pull。

```
本地修改 → git commit → git push → 服务器 git pull → build → restart
```

**优点：** 版本历史完整，冲突可合并
**实现：** 将 ai-quality-portal 也推到 GitHub，建立与 quality-toolbox 相同的 git 工作流

#### 方案2: 分模块隔离
不同窗口只负责不同模块，减少冲突面：
- 窗口A: 只改后端 (`backend/`)
- 窗口B: 只改前端组件 (`frontend/src/components/`)
- 窗口C: 只改前端页面 (`frontend/src/pages/`)

#### 方案3: 服务器端文件锁
部署前先检查文件时间戳，发现被其他窗口修改过则报警。

```python
# 在部署脚本开头检查
last_modified = sftp.stat(remote_path).st_mtime
if last_modified > my_last_known_timestamp:
    print("WARNING: 文件已被其他会话修改!")
    # 先 pull 最新版本再修改
```

#### 方案4（最佳实践）: Git + 单一部署入口

1. 将 `ai-quality-portal` 整个项目纳入 Git（一个仓库或 monorepo）
2. 所有窗口的修改都先 commit + push 到 Git
3. 部署只从 Git pull，不直接 SFTP 上传
4. 如果有冲突，在本地用 git merge 解决后再 push

**立即可执行的第一步：**
```bash
# 在服务器上初始化 git
cd /root/Projects/ai-quality-portal
git init
git add -A
git commit -m "initial: current state of ai-quality-portal"
# 然后关联到 GitHub 仓库
```

这样每次修改前先 `git pull`，改完后 `git push`，彻底避免覆盖。

---

## 关键文件位置

### 本地
```
C:\Users\elizimi\Projects\
├── ai-quality-portal\        # 主项目（前端+后端）
│   ├── backend\app\
│   │   ├── api\v1\ai.py      # AI质量工具API
│   │   ├── api\v1\fmea.py    # FMEA API
│   │   ├── services\deepseek.py
│   │   └── services\fmea_logic.py
│   └── frontend\src\
│       ├── pages\tools\       # 工具页面
│       └── components\quality-toolbox\  # 工具组件
└── quality-toolbox\           # 独立仓库(原始SPA+文档)
    ├── KNOWLEDGE.md
    ├── DEPLOYMENT.md
    └── src\                   # 原始React代码(参考)
```

### 服务器
```
/root/Projects/ai-quality-portal/
├── frontend/    # Next.js (bun run build → next start :3000)
└── backend/     # FastAPI (uvicorn :8000)
```

### GitHub
- https://github.com/13811370971n-stack/quality-toolbox (独立仓库，含文档)
- ai-quality-portal 尚未推送到 GitHub（建议下一步操作）
