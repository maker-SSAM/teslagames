#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building..."
npm run build

npx vite preview --port 4173 --strictPort &
sleep 2
open http://localhost:4173/
wait
