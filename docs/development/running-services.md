# Running Development Services

This guide covers the best ways to run all services with separated logs.

## Quick Start

```bash
# Default: All services with colored, prefixed logs (recommended)
npm run dev

# tmux: Separate tabs for each service
npm run dev:tmux

# iTerm2/Terminal.app: Native tabs
npm run dev:tabs
```

---

## Option 1: Colored Logs with concurrently (Default) ⭐

**Best for:** Quick development, seeing all logs in one terminal

```bash
npm run dev
```

**Features:**
- ✅ All services in one terminal
- ✅ Color-coded logs per service
- ✅ Clear prefixes (WEB, LICENSE, BACKEND, BUILDER)
- ✅ Automatic Prisma generation
- ✅ Automatic port cleanup

**Output Example:**
```
[WEB]     VITE v6.4.1  ready in 959 ms
[LICENSE] VITE v6.4.1  ready in 717 ms
[BACKEND] Server listening at http://0.0.0.0:4000
[BUILDER] Server listening at http://0.0.0.0:4001
```

**Colors:**
- 🔵 WEB - Blue
- 🟣 LICENSE - Magenta
- 🟢 BACKEND - Green
- 🔷 BUILDER - Cyan

---

## Option 2: tmux (Separate Windows) ⭐⭐

**Best for:** Power users, long development sessions, keeping services running while detached

**Install tmux (one time):**
```bash
brew install tmux
```

**Start services:**
```bash
npm run dev:tmux
```

**Features:**
- ✅ Separate window per service
- ✅ Fully isolated logs
- ✅ Services keep running when detached
- ✅ Can reconnect from any terminal
- ✅ Includes port monitoring window

**tmux Commands:**

| Action | Command |
|--------|---------|
| Next window | `Ctrl+b n` |
| Previous window | `Ctrl+b p` |
| Jump to window 0-4 | `Ctrl+b 0-4` |
| Window list | `Ctrl+b w` |
| Detach (services keep running) | `Ctrl+b d` |
| Re-attach | `tmux attach` |
| Kill all services | `tmux kill-session -t all-pet-plus` |

**Windows:**
1. Backend (port 4000)
2. Builder (port 4001)
3. Web (port 3000)
4. Licensing (port 3001)
5. Monitor (port status)

---

## Option 3: Native Terminal Tabs

**Best for:** macOS users with iTerm2 or Terminal.app

```bash
npm run dev:tabs
```

**Features:**
- ✅ Native macOS terminal tabs
- ✅ Separate tab per service
- ✅ Familiar macOS keyboard shortcuts

**From Cursor/VS Code:**
The script will provide instructions for manual tab setup.

---

## Option 4: Individual Services

Run services one at a time for focused debugging:

```bash
# Frontend apps
npm run dev:web         # Main web app (port 3000)
npm run dev:licensing   # Pet licensing app (port 3001)

# Backend services
npm run dev:backend     # Main backend (port 4000)
npm run dev:builder     # Builder service (port 4001)
```

---

## Troubleshooting

### Ports Already in Use

```bash
# Check which ports are in use
npm run ports:check

# Kill processes on dev ports
npm run ports:kill

# Detailed port info
npm run ports:status
```

### Service Won't Start

1. **Check Prisma:**
```bash
npm run db:generate
```

2. **Check Environment:**
```bash
# Ensure .env files exist
ls apps/web/.env.local
ls services/backend/.env
```

3. **Check Dependencies:**
```bash
npm install
```

### tmux Session Already Exists

```bash
# Kill existing session
tmux kill-session -t all-pet-plus

# Then restart
npm run dev:tmux
```

---

## Comparison

| Feature | concurrently | tmux | Native Tabs | Individual |
|---------|-------------|------|-------------|-----------|
| Setup | ✅ None | 🍺 brew install | ✅ Built-in | ✅ None |
| One Command | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| Isolated Logs | ⚠️ Color-coded | ✅ Separate | ✅ Separate | ✅ Separate |
| Easy Navigation | ✅ Scroll | ⚠️ Learn keys | ✅ Native | ❌ Manual |
| Background Running | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Reconnectable | ❌ No | ✅ Yes | ❌ No | ❌ No |

---

## Recommended Workflow

**For daily development:**
```bash
npm run dev
```
Use concurrently with colored logs - fastest to start, easiest to use.

**For long sessions or debugging:**
```bash
npm run dev:tmux
```
Use tmux when you need to:
- Keep services running while working on other tasks
- Debug specific services in isolation
- Reconnect to running services from different terminals

**For focused debugging:**
```bash
npm run dev:web  # Just the web app
```
Run individual services when debugging specific issues.

---

## Related Documentation

- [Port Configuration](./port-configuration.md)
- [Development Workflow](./dev-workflow.md)
- [Troubleshooting FAQ](../troubleshooting-faq.md)

