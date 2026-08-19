# 质量工具箱部署指南

## 环境信息

| 项目 | 值 |
|------|-----|
| 服务器 | 阿里云 ECS (aliyun_server_2) |
| 服务器 IP | 8.146.227.10 |
| 操作系统 | Ubuntu |
| 域名 | aidmaic.top |
| 访问端口 | 8080 |
| 前端框架 | Next.js 14 (端口 3000) |
| 后端框架 | FastAPI (端口 8000) |
| 反向代理 | Nginx (端口 80/8080) |
| 包管理器 | bun |
| AI API | DeepSeek |

---

## 项目路径

```
服务器:
  /root/Projects/ai-quality-portal/
  ├── frontend/          # Next.js 前端
  └── backend/           # FastAPI 后端

本地:
  C:\Users\elizimi\Projects\ai-quality-portal\
  C:\Users\elizimi\Projects\quality-toolbox\     # 独立仓库(参考代码)
```

---

## 部署步骤

### 1. 连接服务器

所有部署通过 Python + paramiko 执行，凭证存储在 `~/.credentials/vault.enc`。

```python
import sys, os
sys.path.insert(0, os.path.expanduser("~/.credentials"))
from credential_manager import CredentialManager
import paramiko

cm = CredentialManager()
creds = cm.get("aliyun_server_2")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(creds["host"], username=creds["user"], password=creds["password"])
```

### 2. 上传文件 (SFTP)

```python
sftp = client.open_sftp()

# 上传单个文件
with open(local_path, "r", encoding="utf-8") as f:
    content = f.read()
with sftp.file(remote_path, "w") as f:
    f.write(content)

sftp.close()
```

### 3. 前端构建与部署

```bash
# 安装依赖
export PATH=/root/.bun/bin:$PATH
cd /root/Projects/ai-quality-portal/frontend
bun install

# 构建
bun run build

# 重启 Next.js
kill $(pgrep -f 'next-server') 2>/dev/null
sleep 2
nohup npm exec next start -- -p 3000 > /tmp/nextjs.log 2>&1 &
```

### 4. 后端部署

```bash
# 重启 FastAPI
kill $(pgrep -f 'uvicorn') 2>/dev/null
sleep 1
cd /root/Projects/ai-quality-portal/backend
source venv/bin/activate
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
```

### 5. 验证

```bash
# 检查前端
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/tools

# 检查后端
curl -s http://127.0.0.1:8000/api/v1/ai/health

# 检查 Nginx 代理
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/tools
```

---

## Nginx 配置

文件位置: `/etc/nginx/sites-available/ai-quality-portal`

关键配置：
```nginx
server {
    listen 8080;
    server_name aidmaic.top www.aidmaic.top _;

    # 前端 (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 质量工具箱静态文件 (独立SPA备份，可选)
    location /quality-toolbox/ {
        alias /root/Projects/quality-toolbox/dist/;
        index index.html;
        try_files $uri $uri/ /quality-toolbox/index.html;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

修改后验证并重载：
```bash
nginx -t
systemctl reload nginx
```

---

## 常见操作

### 快速部署脚本模板

```python
"""Quick deploy template"""
import sys, os, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, os.path.expanduser("~/.credentials"))
from credential_manager import CredentialManager
import paramiko

cm = CredentialManager()
creds = cm.get("aliyun_server_2")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(creds["host"], username=creds["user"], password=creds["password"])
sftp = client.open_sftp()

# --- 上传文件 ---
# with open(local_path, "r", encoding="utf-8") as f:
#     content = f.read()
# with sftp.file(remote_path, "w") as f:
#     f.write(content)

sftp.close()

# --- 执行命令 ---
commands = [
    "export PATH=/root/.bun/bin:$PATH && cd /root/Projects/ai-quality-portal/frontend && bun run build 2>&1 | tail -5",
    "kill $(pgrep -f 'next-server') 2>/dev/null; sleep 2",
    "cd /root/Projects/ai-quality-portal/frontend && nohup npm exec next start -- -p 3000 > /tmp/nextjs.log 2>&1 &",
]

for cmd in commands:
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=300)
    ec = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    if out: print(f"  {out}")
    if ec != 0: print("  FAILED!"); break

client.close()
print("Done!")
```

### 从 GitHub 拉取更新并部署

```bash
# 在服务器上执行
cd /root/Projects/quality-toolbox
git pull origin main
export PATH=/root/.bun/bin:$PATH
bun run build
chmod -R 755 dist/
```

### 新增质量工具的步骤

1. **添加工具数据** — 编辑 `frontend/src/components/quality-toolbox/data/tools.ts`，添加新的 tool 对象
2. **更新 DMAIC 映射** — 编辑 `frontend/src/components/quality-toolbox/data/dmaicPhases.ts`
3. **如果有交互功能** — 在 `frontend/src/components/quality-toolbox/workshop/` 创建组件
4. **创建页面** — 在 `frontend/src/pages/tools/quality-toolbox/workshop/<tool-name>/index.tsx` 创建页面包装
5. **构建部署** — `bun run build` + 重启 Next.js

### 新增 AI 能力的步骤

1. **后端** — 在 `backend/app/api/v1/ai.py` 添加新 endpoint
2. **Prompt** — 设计 system prompt，要求返回 JSON 格式
3. **Fallback** — 在 `backend/app/services/fallback_knowledge.py` 添加备用知识
4. **前端** — 在工具组件中添加 AI 按钮 + fetch 调用
5. **重启后端** — `kill uvicorn` + 重启
6. **重建前端** — `bun run build` + 重启 Next.js

---

## 注意事项

| 问题 | 解决方案 |
|------|----------|
| Nginx 无法读取 /root/ 下文件 | `chmod 755 /root` + `chmod -R 755 dist/` |
| TypeScript `[...new Set()]` 报错 | 使用 `Array.from(new Set(...))` |
| D3.js 在 SSR 中报错 | 使用 `dynamic(() => import(...), { ssr: false })` |
| DeepSeek API 超时 | 后端设置 30s timeout + 自动 fallback 到本地知识库 |
| bun 未安装 | `apt install unzip && curl -fsSL https://bun.sh/install \| bash` |
| Next.js 进程管理 | 使用 nohup + 手动 kill/restart（未配置 pm2/systemd） |
| 前端构建后旧页面仍在 | 确保 kill next-server 后等 2 秒再启动新实例 |

---

## 相关凭证

| 凭证 | 存储位置 |
|------|----------|
| 服务器 SSH | `~/.credentials/vault.enc` → `aliyun_server_2` |
| GitHub SSH | `~/.ssh/id_github` |
| DeepSeek API Key | 服务器端环境变量 / `backend/app/services/deepseek.py` |

---

## 相关链接

| 资源 | 地址 |
|------|------|
| 线上应用 | http://8.146.227.10:8080/tools |
| GitHub 仓库 | https://github.com/13811370971n-stack/quality-toolbox |
| AI Health API | http://8.146.227.10:8080/api/v1/ai/health |
| FastAPI Docs | http://8.146.227.10:8080/docs |
