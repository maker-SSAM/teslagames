@echo off
cd /d "%~dp0"

REM 빌드 없이 소스 코드를 바로 서빙한다 (Node/npm 불필요).
REM 방금 고친 .js/.html 파일을 저장하고 브라우저만 새로고침하면 바로 반영된다.
REM 단, dist/serve.bat와 달리 이건 "원본 소스"이므로 Firebase에 배포되는
REM 최종본과 100%% 동일하지는 않을 수 있다 (배포 전 npm run build로 최종 확인 권장).

start "" "http://localhost:8200"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve_source.ps1"
