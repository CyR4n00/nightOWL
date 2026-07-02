#!/bin/bash
echo "Starting NightOwl Development Server..."

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Automatically generate .env file
echo "Setting up environment variables..."
node "$DIR/setup_env.js"

cd "$DIR/web-prototype"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the dev server
echo "Starting app..."
npm run dev
