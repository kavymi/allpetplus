#!/bin/bash
# Start development servers in separate terminal tabs (macOS iTerm2/Terminal.app)

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Detect terminal type
if [[ "$TERM_PROGRAM" == "iTerm.app" ]]; then
  # iTerm2 specific
  osascript <<END
    tell application "iTerm"
      tell current window
        -- Backend tab
        create tab with default profile
        tell current session
          write text "cd $PROJECT_ROOT && npm run dev:backend"
        end tell
        
        -- Frontend tab
        create tab with default profile
        tell current session
          write text "cd $PROJECT_ROOT && npm run dev:web"
        end tell
        
        -- Optional: More tabs
        -- create tab with default profile
        -- tell current session
        --   write text "cd $PROJECT_ROOT && npm run dev:worker"
        -- end tell
      end tell
    end tell
END

elif [[ "$TERM_PROGRAM" == "Apple_Terminal" ]]; then
  # Terminal.app specific
  osascript <<END
    tell application "Terminal"
      -- Backend tab
      do script "cd $PROJECT_ROOT && npm run dev:backend"
      
      -- Frontend tab
      do script "cd $PROJECT_ROOT && npm run dev:web" in window 1
      
      -- Optional: More tabs
      -- do script "cd $PROJECT_ROOT && npm run dev:worker" in window 1
    end tell
END

else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "⚠️  Native tab support requires iTerm2 or Terminal.app"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "You're running from Cursor/VS Code's integrated terminal."
  echo ""
  echo "Choose one of these options:"
  echo ""
  echo "Option 1 - Use Cursor's Built-in Terminal Tabs (Recommended):"
  echo "  1. Click the '+' icon in the terminal tab bar (top right)"
  echo "  2. In the new tabs, run:"
  echo "     Tab 1: npm run dev:backend"
  echo "     Tab 2: npm run dev:web"
  echo ""
  echo "Option 2 - Install tmux for automatic tabs:"
  echo "  brew install tmux"
  echo "  npm run dev:tmux"
  echo ""
  echo "Option 3 - Run from native Terminal.app or iTerm2:"
  echo "  Open Terminal.app or iTerm2, then run:"
  echo "  cd $PROJECT_ROOT && npm run dev:tabs"
  echo ""
  echo "Option 4 - Single terminal with combined logs:"
  echo "  npm run dev"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

