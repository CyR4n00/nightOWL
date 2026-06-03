@echo off
echo Starting NightOwl Development Server...

cd web-prototype

REM Install dependencies if node_modules doesn't exist
IF NOT EXIST "node_modules\" (
    echo Installing dependencies...
    npm install
)

REM Start the dev server
echo Starting app...
npm run dev
pause
