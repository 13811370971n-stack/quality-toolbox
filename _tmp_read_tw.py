"""Read tailwind config"""
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
    "cat /root/Projects/ai-quality-portal/frontend/tailwind.config.js 2>/dev/null",
    "cat /root/Projects/ai-quality-portal/frontend/tailwind.config.ts 2>/dev/null",
    # Check the Navbar for color/font reference
    "cat /root/Projects/ai-quality-portal/frontend/src/components/layout/Navbar.tsx | head -40",
]

for cmd in commands:
    print(f"> {cmd.split('/')[-1] if '/' in cmd else cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=15)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    if out:
        print(out[:3000])
    print()

client.close()
