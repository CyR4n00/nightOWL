@echo off
echo Starting NightOwl Development Server...

REM Automatically generate .env file
echo Setting up environment variables...
node setup_env.js

cd web-prototype

REM Install dependencies if node_modules doesn't exist
IF NOT EXIST "node_modules\" (
    echo Installing dependencies...
    call npm install
)

REM Start the dev server
echo Starting app...
call npm run dev
pause
