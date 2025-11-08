#!/bin/bash

# Port checking and management script for AllPetPlus development
# Usage:
#   ./scripts/check-ports.sh           # Check which ports are in use
#   ./scripts/check-ports.sh --kill    # Kill processes on dev ports
#   ./scripts/check-ports.sh --verbose # Show detailed information

# Define development ports
FRONTEND_PORTS=(3000 3001)
BACKEND_PORTS=(4000 4001 4002)
ALL_PORTS=("${FRONTEND_PORTS[@]}" "${BACKEND_PORTS[@]}")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
KILL_MODE=false
VERBOSE=false
EXTRA=false

for arg in "$@"; do
  case $arg in
    --kill)
      KILL_MODE=true
      ;;
    --verbose)
      VERBOSE=true
      ;;
    --extra)
      EXTRA=true
      VERBOSE=true
      ;;
    *)
      echo "Unknown argument: $arg"
      echo "Usage: $0 [--kill] [--verbose] [--extra]"
      exit 1
      ;;
  esac
done

# Function to check if a port is in use
check_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  
  if [ -z "$pid" ]; then
    if [ "$VERBOSE" = true ]; then
      echo -e "${GREEN}✓${NC} Port $port is available"
    fi
    return 1
  else
    local process_name=$(ps -p $pid -o comm= 2>/dev/null)
    echo -e "${YELLOW}⚠${NC}  Port $port is in use by PID $pid ($process_name)"
    
    if [ "$VERBOSE" = true ]; then
      echo -e "   Command: $(ps -p $pid -o command= 2>/dev/null)"
    fi
    
    return 0
  fi
}

# Function to kill process on port
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  
  if [ -z "$pid" ]; then
    if [ "$VERBOSE" = true ]; then
      echo -e "${GREEN}✓${NC} Port $port is already free"
    fi
    return 1
  else
    local process_name=$(ps -p $pid -o comm= 2>/dev/null)
    echo -e "${RED}✗${NC} Killing process on port $port (PID: $pid, $process_name)"
    kill -9 $pid 2>/dev/null
    
    # Verify it was killed
    sleep 0.5
    if lsof -ti:$port >/dev/null 2>&1; then
      echo -e "${RED}✗${NC} Failed to kill process on port $port"
      return 1
    else
      echo -e "${GREEN}✓${NC} Successfully killed process on port $port"
      return 0
    fi
  fi
}

# Main logic
echo ""
echo -e "${BLUE}=== AllPetPlus Port Management ===${NC}"
echo ""

if [ "$KILL_MODE" = true ]; then
  echo "Killing processes on development ports..."
  echo ""
  
  for port in "${ALL_PORTS[@]}"; do
    kill_port $port
  done
  
else
  echo "Checking development ports..."
  echo ""
  
  echo -e "${BLUE}Frontend Ports:${NC}"
  FRONTEND_BUSY=false
  for port in "${FRONTEND_PORTS[@]}"; do
    if check_port $port; then
      FRONTEND_BUSY=true
    fi
  done
  
  if [ "$FRONTEND_BUSY" = false ] && [ "$VERBOSE" = true ]; then
    echo -e "${GREEN}  All frontend ports are available${NC}"
  fi
  
  echo ""
  echo -e "${BLUE}Backend Ports:${NC}"
  BACKEND_BUSY=false
  for port in "${BACKEND_PORTS[@]}"; do
    if check_port $port; then
      BACKEND_BUSY=true
    fi
  done
  
  if [ "$BACKEND_BUSY" = false ] && [ "$VERBOSE" = true ]; then
    echo -e "${GREEN}  All backend ports are available${NC}"
  fi
  
  echo ""
  
  # Check if any ports are busy
  ANY_BUSY=false
  for port in "${ALL_PORTS[@]}"; do
    if lsof -ti:$port >/dev/null 2>&1; then
      ANY_BUSY=true
      break
    fi
  done
  
  if [ "$ANY_BUSY" = true ]; then
    echo -e "${YELLOW}⚠  Some ports are in use. Run with --kill to free them:${NC}"
    echo "   ./scripts/check-ports.sh --kill"
  else
    echo -e "${GREEN}✓ All development ports are available!${NC}"
  fi
  
  # Show extra information if --extra flag is set
  if [ "$EXTRA" = true ]; then
    echo ""
    echo -e "${BLUE}=== Port Assignment Reference ===${NC}"
    echo ""
    echo -e "${BLUE}Frontend Applications:${NC}"
    echo "  3000 - apps/web (Main web app)"
    echo "  3001 - apps/pet-licensing (Pet licensing app)"
    echo ""
    echo -e "${BLUE}Backend Services:${NC}"
    echo "  4000 - services/backend (Main API)"
    echo "  4001 - services/builder-service (Builder service)"
    echo "  4002 - services/test (Test service)"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo "  npm run dev              - Start all services"
    echo "  npm run ports:check      - Check port status"
    echo "  npm run ports:kill       - Kill processes on ports"
    echo "  npm run ports:status     - Show this detailed status"
  fi
fi

echo ""

