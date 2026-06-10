#!/bin/bash
echo "Starting NightOwl Development Server..."

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/web-prototype"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the dev server
echo "Starting app..."
npm run dev
