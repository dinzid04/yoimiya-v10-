#!/bin/bash
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Starting Yoimiya-MD Bot...${NC}"

while :
do
    echo -e "${GREEN}Running Node.js...${NC}"
    # Using --expose-gc for the RAM cleaner logic
    node --expose-gc index.js

    # Check exit code
    if [ $? -eq 0 ]; then
        echo -e "${CYAN}Bot stopped safely.${NC}"
        break
    else
        echo -e "${CYAN}Bot crashed or restarted. Respawning in 3 seconds...${NC}"
        sleep 3
    fi
done
