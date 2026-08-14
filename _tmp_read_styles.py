"""Read main portal styles to match quality-toolbox"""
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

commands = [
    # Check main portal's global CSS
    "cat /root/Projects/ai-quality-portal/frontend/src/styles/globals.css 2>/dev/null | head -80",
    # Check tailwind config for color scheme
    "cat /root/Projects/ai-quality-portal/frontend/tailwind.config.ts 2>/dev/null | head -60",
    # Check the index page for style reference
    "cat /root/Projects/ai-quality-portal/frontend/src/pages/index.tsx 2>/dev/null | head -50",
]

for cmd in commands:
    print(f"{'='*60}")
    print(f"> {cmd.split('|')[0].strip()}")
    print(f"{'='*60}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=15)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    if out:
        print(out)
    print()

client.close()
