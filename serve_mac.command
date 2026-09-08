#!/bin/bash
cd "$(dirname "$0")"

PORT=8100

# npm(Node.js)이 있는 Mac(예: 집)이면 최신 소스로 dist를 다시 빌드한다.
# npm이 없는 Mac이면 이 단계는 건너뛰고, 이미 존재하는(다른 PC에서 동기화된)
# dist 폴더를 그대로 서빙한다 — Windows용 serve.bat과 같은 방식.
if ! command -v npm >/dev/null 2>&1; then
  echo "[안내] npm(Node.js)이 이 Mac에는 없어서 빌드를 건너뜁니다."
  echo "기존에 동기화된 dist 폴더를 그대로 서빙합니다 (최신 변경사항이 아닐 수 있음)."
else
  if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
  fi
  echo "Building..."
  if ! npm run build; then
    echo "[경고] 빌드 실패. 기존 dist 폴더로 계속 서빙을 시도합니다."
    echo "(node_modules가 다른 PC에서 동기화되어 깨졌다면 node_modules를 지우고 다시 시도해보세요.)"
  fi
fi

if [ ! -d dist ]; then
  echo "[오류] dist 폴더가 없습니다. node/npm이 있는 PC에서 'npm run build'를 먼저 실행해주세요."
  read -p "엔터를 누르면 창이 닫힙니다"
  exit 1
fi

# node 없이도 서빙할 수 있게, Vite 대신 macOS에 기본 내장된 Python3의
# 정적 파일 서버를 사용한다 (Windows의 serve.ps1과 같은 역할).
if ! command -v python3 >/dev/null 2>&1; then
  echo "[오류] python3도 npm도 이 Mac에서 찾을 수 없어 로컬 서버를 띄울 수 없습니다."
  echo "Node.js(https://nodejs.org)를 설치하거나, python3(터미널에 'python3 --version'으로 확인)를 설치해주세요."
  read -p "엔터를 누르면 창이 닫힙니다"
  exit 1
fi

echo "로컬 서버 시작: http://localhost:$PORT/  (서빙 대상: dist)"
lan_ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
if [ -n "$lan_ip" ]; then
  echo "같은 와이파이의 태블릿/휴대폰에서: http://$lan_ip:$PORT/"
fi
echo "(이 창을 닫으면 서버가 멈춥니다. 종료하려면 Ctrl+C)"

python3 -m http.server "$PORT" --directory dist --bind 0.0.0.0 &
SERVER_PID=$!
sleep 1
open "http://localhost:$PORT/"
wait $SERVER_PID
