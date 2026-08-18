"""
Deploy Plan D Demo:
1. Add quality-toolbox to AI tools list (fallbackTools + API)
2. Create /tools/quality-toolbox page (iframe embed)
3. Add embedded mode to quality-toolbox (hide nav when ?embedded=true)
4. Update methodology page link
"""
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

# ============================================================
# Step 1: Add quality-toolbox card to /tools page
# ============================================================
print("=== Step 1: Update tools/index.tsx - add Quality Toolbox card ===")

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/pages/tools/index.tsx", "r") as f:
    tools_page = f.read().decode()

# Add quality-toolbox to fallbackTools
new_tool_entry = """  {
    id: 'quality-toolbox', name: 'Quality Toolbox', name_zh: '质量工具箱',
    description: 'Interactive quality tools for learning and practice - 150+ tools organized by DMAIC.',
    description_zh: '交互式质量工具学习平台。以DMAIC为主线组织150+工具，支持在线使用鱼骨图、控制图、帕累托图等。含知识图谱、学习路径和智能推荐。',
    category: 'toolbox', status: 'active', icon: 'toolbox', route: '/tools/quality-toolbox',
  },"""

# Insert after the last tool in fallbackTools (before the ];)
tools_page = tools_page.replace(
    "    id: 'ai-hypothesis', name: 'AI-Hypothesis Testing', name_zh: 'AI假设检验',\n    description: 'Automated hypothesis test selection.',\n    description_zh: '自动假设检验选择与自然语言解读。',\n    category: 'analysis', status: 'coming_soon', icon: 'check2-circle', route: '/tools/ai-hypothesis', requiredRole: 'vip',\n  },\n];",
    "    id: 'ai-hypothesis', name: 'AI-Hypothesis Testing', name_zh: 'AI假设检验',\n    description: 'Automated hypothesis test selection.',\n    description_zh: '自动假设检验选择与自然语言解读。',\n    category: 'analysis', status: 'coming_soon', icon: 'check2-circle', route: '/tools/ai-hypothesis', requiredRole: 'vip',\n  },\n" + new_tool_entry + "\n];"
)

# Add 'toolbox' to categoryLabels
tools_page = tools_page.replace(
    "  analysis: '数据分析',\n};",
    "  analysis: '数据分析',\n  toolbox: '工具箱',\n};"
)

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/pages/tools/index.tsx", "w") as f:
    f.write(tools_page)
print("  [OK] tools/index.tsx updated")

# ============================================================
# Step 2: Create /tools/quality-toolbox/index.tsx page
# ============================================================
print("\n=== Step 2: Create tools/quality-toolbox/index.tsx ===")

quality_toolbox_page = """import Head from 'next/head';
import Link from 'next/link';

export default function QualityToolboxPage() {
  return (
    <>
      <Head>
        <title>质量工具箱 - AI Quality Portal</title>
      </Head>

      {/* Breadcrumb header */}
      <div className="pt-16">
        <div className="bg-mckinsey-light border-b border-mckinsey-border px-6 lg:px-16 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <Link href="/tools" className="text-mckinsey-muted hover:text-mckinsey-navy transition-colors">
              AI工具集
            </Link>
            <span className="text-mckinsey-muted">/</span>
            <span className="text-mckinsey-navy font-medium">质量工具箱</span>
          </div>
        </div>
      </div>

      {/* Embedded Quality Toolbox */}
      <div className="w-full" style={{ height: 'calc(100vh - 120px)' }}>
        <iframe
          src="/quality-toolbox/?embedded=true"
          className="w-full h-full border-0"
          title="Quality Toolbox"
          allow="clipboard-write"
        />
      </div>
    </>
  );
}
"""

# Create directory
client.exec_command("mkdir -p /root/Projects/ai-quality-portal/frontend/src/pages/tools/quality-toolbox")
import time; time.sleep(0.5)

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/pages/tools/quality-toolbox/index.tsx", "w") as f:
    f.write(quality_toolbox_page)
print("  [OK] tools/quality-toolbox/index.tsx created")

# ============================================================
# Step 3: Update Layout.tsx to hide footer for quality-toolbox
# ============================================================
print("\n=== Step 3: Update Layout.tsx ===")

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/components/layout/Layout.tsx", "r") as f:
    layout = f.read().decode()

layout = layout.replace(
    "const hideFooter = router.pathname.startsWith('/cases/[') || router.pathname.includes('/ai-spc');",
    "const hideFooter = router.pathname.startsWith('/cases/[') || router.pathname.includes('/ai-spc') || router.pathname.includes('/quality-toolbox');"
)

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/components/layout/Layout.tsx", "w") as f:
    f.write(layout)
print("  [OK] Layout.tsx updated")

# ============================================================
# Step 4: Update methodology page link
# ============================================================
print("\n=== Step 4: Update methodology link ===")

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/pages/methodology.tsx", "r") as f:
    method = f.read().decode()

method = method.replace('href="/quality-toolbox/"', 'href="/tools/quality-toolbox"')

with sftp.file("/root/Projects/ai-quality-portal/frontend/src/pages/methodology.tsx", "w") as f:
    f.write(method)
print("  [OK] methodology.tsx link updated")

sftp.close()

# ============================================================
# Step 5: Rebuild Next.js
# ============================================================
print("\n=== Step 5: Rebuild Next.js ===")
cmd = "export PATH=/root/.bun/bin:$PATH && cd /root/Projects/ai-quality-portal/frontend && bun run build 2>&1 | tail -15"
stdin, stdout, stderr = client.exec_command(cmd, timeout=180)
ec = stdout.channel.recv_exit_status()
out = stdout.read().decode().strip()
print(f"  {out}")
if ec != 0:
    print("  BUILD FAILED!")
else:
    print("  [OK] Build successful")

# Restart Next.js
print("\n=== Step 6: Restart Next.js ===")
client.exec_command("kill $(pgrep -f 'next-server') 2>/dev/null")
import time; time.sleep(2)
client.exec_command("cd /root/Projects/ai-quality-portal/frontend && nohup npm exec next start -- -p 3000 > /tmp/nextjs.log 2>&1 &")
time.sleep(4)

# Verify
stdin, stdout, stderr = client.exec_command("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/tools/quality-toolbox")
stdout.channel.recv_exit_status()
code = stdout.read().decode().strip()
print(f"  /tools/quality-toolbox -> HTTP {code}")

client.close()
print(f"\n{'='*50}")
print(f"Plan D Demo deployed!")
print(f"Access: http://{creds['host']}:8080/tools/quality-toolbox")
print(f"{'='*50}")
