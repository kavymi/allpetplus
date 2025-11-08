#!/bin/bash
# Start development servers in tmux with separate tabs (windows)

SESSION="all-pet-plus-dev"

# Check if tmux session exists
tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then
  # Create new session with first window for backend
  tmux new-session -d -s $SESSION -n "Backend"
  tmux send-keys -t $SESSION:Backend 'npm run dev:backend' C-m
  
  # Create new window for frontend
  tmux new-window -t $SESSION -n "Frontend"
  tmux send-keys -t $SESSION:Frontend 'npm run dev:web' C-m
  
  # Optional: Add more service windows
  # tmux new-window -t $SESSION -n "Worker"
  # tmux send-keys -t $SESSION:Worker 'npm run dev:worker' C-m
  
  # Select first window
  tmux select-window -t $SESSION:Backend
fi

# Attach to session
tmux attach-session -t $SESSION

# Navigate between tabs with:
# - Ctrl+b n (next tab)
# - Ctrl+b p (previous tab)
# - Ctrl+b 0/1/2... (specific tab number)
# - Ctrl+b w (interactive tab list)

