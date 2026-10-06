#!/bin/bash
cd "$(dirname "$0")"

PORT=8200

# 빌드 없이 소스 코드를 바로 서빙한다 (Node/npm 불필요, dist를 보는
# serve_mac.command와 달리 이 PC의 원본 소스를 그대로 보여준다).
# 방금 고친 .js/.html 파일을 저장하고 브라우저만 새로고침하면 바로 반영된다.

if ! command -v python3 >/dev/null 2>&1; then
  echo "[오류] python3을 이 Mac에서 찾을 수 없어 로컬 서버를 띄울 수 없습니다."
  echo "python3(터미널에 'python3 --version'으로 확인)을 설치해주세요."
  read -p "엔터를 누르면 창이 닫힙니다"
  exit 1
fi

echo "로컬 서버 시작: http://localhost:$PORT/  (서빙 대상: 소스 코드 원본, 빌드 아님)"
lan_ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
if [ -n "$lan_ip" ]; then
  echo "같은 와이파이의 태블릿/휴대폰에서: http://$lan_ip:$PORT/"
fi
echo "(이 창을 닫으면 서버가 멈춥니다. 종료하려면 Ctrl+C)"

python3 -m http.server "$PORT" --directory . --bind 0.0.0.0 &
SERVER_PID=$!
sleep 1
open "http://localhost:$PORT/"
wait $SERVER_PID
