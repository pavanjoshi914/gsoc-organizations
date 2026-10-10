#!/usr/bin/env bash
# Quick launcher for GSoC Organizations Pro
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/home/pavan/.nvm/versions/node/v24.18.0/bin:$PATH"

echo "Starting GSoC Organizations Pro..."
cd "$DIR"
npm run dev -- --host 0.0.0.0 --port 3000

