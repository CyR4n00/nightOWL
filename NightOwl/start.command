#!/bin/bash
echo "Starting NightOwl Development Server..."

cd "$(dirname "$0")/web-prototype"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the dev server
echo "Starting app..."
npm run dev
