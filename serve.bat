@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

echo Building...
call npm run build

start "teslagame server" cmd /k npx vite preview --port 4173 --strictPort
timeout /t 2 /nobreak >nul
start "" http://localhost:4173/
