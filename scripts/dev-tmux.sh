#!/bin/bash
# Start all development services in tmux with separate panes
# Navigate: Ctrl+b n (next) | Ctrl+b p (previous) | Ctrl+b w (list)
# Detach: Ctrl+b d | Kill: tmux kill-session -t all-pet-plus

SESSION="all-pet-plus"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Kill existing session if it exists
tmux kill-session -t $SESSION 2>/dev/null

# Create new session with backend services in a 2x2 layout
cd "$PROJECT_ROOT"

# Generate Prisma clients first
echo "🔄 Generating Prisma clients..."
npm run db:generate

# Kill any processes on dev ports
echo "🧹 Cleaning up ports..."
npm run ports:kill

# Create session with backend service
tmux new-session -d -s $SESSION -n "Backend" -c "$PROJECT_ROOT"
tmux send-keys -t $SESSION:Backend 'npm run dev:backend' C-m

# Create window for builder service
tmux new-window -t $SESSION -n "Builder" -c "$PROJECT_ROOT"
tmux send-keys -t $SESSION:Builder 'npm run dev:builder' C-m

# Create window for web app
tmux new-window -t $SESSION -n "Web" -c "$PROJECT_ROOT"
tmux send-keys -t $SESSION:Web 'npm run dev:web' C-m

# Create window for pet-licensing app
tmux new-window -t $SESSION -n "Licensing" -c "$PROJECT_ROOT"
tmux send-keys -t $SESSION:Licensing 'npm run dev:licensing' C-m

# Optional: Create a logs overview window
tmux new-window -t $SESSION -n "Monitor" -c "$PROJECT_ROOT"
tmux send-keys -t $SESSION:Monitor 'npm run ports:status' C-m

# Select first window
tmux select-window -t $SESSION:Backend

echo "✅ All services starting in tmux session: $SESSION"
echo ""
echo "📚 tmux Quick Reference:"
echo "  Navigate:"
echo "    Ctrl+b n     - Next window"
echo "    Ctrl+b p     - Previous window"
echo "    Ctrl+b 0-4   - Jump to window number"
echo "    Ctrl+b w     - Interactive window list"
echo "  Session:"
echo "    Ctrl+b d     - Detach (services keep running)"
echo "    tmux attach  - Re-attach to session"
echo "  Kill:"
echo "    tmux kill-session -t $SESSION"
echo ""

# Attach to session
tmux attach-session -t $SESSION
