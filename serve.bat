@echo off
cd /d "%~dp0"

REM npm(Node.js)이 있는 PC(예: 집)면 최신 소스로 dist를 다시 빌드한다.
REM npm이 없는 PC(예: 학교)면 이 단계는 건너뛰고, OneDrive로 동기화되어
REM 이미 존재하는 dist 폴더를 그대로 서빙한다 — easy3D와 같은 방식.
where npm >nul 2>nul
if errorlevel 1 (
  echo [안내] npm^(Node.js^)이 이 PC에는 없어서 빌드를 건너뜁니다.
  echo 기존에 동기화된 dist 폴더를 그대로 서빙합니다 ^(최신 변경사항이 아닐 수 있음^).
) else (
  if not exist node_modules (
    echo Installing dependencies...
    call npm install
  )
  echo Building...
  call npm run build
  if errorlevel 1 (
    echo [경고] 빌드 실패. 기존 dist 폴더로 계속 서빙을 시도합니다.
    echo ^(node_modules가 다른 PC에서 동기화되어 깨졌다면 node_modules를 지우고 다시 시도해보세요.^)
  )
)

start "" "http://localhost:8100"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
