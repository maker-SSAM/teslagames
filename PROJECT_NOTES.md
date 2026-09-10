# 테슬라 뒷자리 게임 사이트 — 프로젝트 노트

마지막 갱신: 2026-09-10
이 문서는 여러 컴퓨터를 오가며 작업을 이어가기 위한 진행 상황/결정 기록입니다.
새 세션(다른 PC, 새 대화)에서 작업을 이어갈 때는 이 문서를 먼저 읽어주세요.

---

## 프로젝트 한 줄 요약

테슬라 **Model Y Juniper** 2열(뒷좌석) 스크린에서, 미취학~저학년 자녀(한국나이 5세·7세)가
광고·댓글 없이 간단한 터치/드래그 게임을 가지고 놀 수 있는 **오프라인 지원 게임 허브**를
직접 만드는 개인 프로젝트.

- 배포 주소: https://teslagames.web.app (Firebase Hosting)
- 저장소 루트: 이 폴더 (`teslagames`), OneDrive로 여러 PC에 동기화됨
- Git 사용자: `maker-SSAM` / 이메일: erebus921@gmail.com

---

## 확정된 요구사항 (사용자 답변 기준)

| 항목 | 내용 |
|---|---|
| 실행 화면 | **테슬라 Model Y Juniper 2열 스크린**이 메인 타깃. 뒷좌석 거치 태블릿도 보조로 지원 |
| 오프라인 | **필수** — 터널/시골길처럼 인터넷이 끊겨도 끊김 없이 동작해야 함 |
| 대상 연령 | 미취학~저학년 (한국나이 5세, 7세 = 국제나이 약 4세, 6세) |
| 조작 방식 | **탭 또는 드래그(스와이프)만**. 복잡한 버튼 조합·키보드 금지 |
| 인원 | **2인용 필수** — 형제자매가 화면 하나로 같이(협동) 또는 각자(대결) 플레이. 서로 싸우는 것 방지 목적 |
| 콘텐츠 확장 규모 | 아직 미정 — 게임 개수보다 **기반(허브+배포+오프라인)을 먼저 탄탄히** 하는 게 우선 |
| 난이도 | "지지 않는 게임(no fail state)"이 필수는 아님. 다만 **난이도는 낮게** — 5세/7세 둘 다 무리 없이 |
| 레퍼런스 장르 | **앵그리버드**(드래그 조준-발사) / **프루츠닌자**(드래그 스와이프로 베기) 스타일 |
| 시간적 배경 | 아이들이 좀 더 크면 개인 기기(폰/닌텐도 등)로 넘어갈 가능성 → 인프라에 너무 오래 투자하지 말고 실제 플레이 가능한 콘텐츠를 비교적 빨리 낼 것 |
| 비주얼 스타일 | 이모지/아이콘 대신 **직접 그린 벡터 도형** (원, 삼각형 등 단순 도형 + 원색) |
| 배포 도메인 밖 원칙 | 광고, 댓글, 계정, 온라인 순위표 등 **일체 없음** — 순수하게 "게임 선택 → 구동"만 하는 심플한 페이지 |

---

## 핵심 설계 원칙 (앞으로 모든 작업의 기준)

1. 광고 · 댓글 · 계정 · 온라인 기능 없음 — 게임 선택과 구동만
2. 오프라인 필수 (PWA + Service Worker 캐싱 예정, 아직 미구현)
3. 조작은 탭 또는 드래그만
4. 읽기 능력 불필요 — 도형·색·소리로 이해되는 UI
5. 난이도는 낮게 (단, "완전히 안 지는 게임"을 강제하지는 않음 — 사용자가 이 조건은 완화함)
6. 화면 분할 2인 동시 플레이가 기본값 (혼자 해도 자연스럽게 동작)
7. **Node 없이도 게임 코드를 편집·구동할 수 있어야 함** (여러 PC를 오가며 작업하기 때문 — 아래 참고)

---

## 지금까지 완료한 작업

### 1. balloon-stars(별 모으기 열기구) 비주얼을 벡터 도형으로 변경
- 풍선: 주황 원 → **빨간 원** (`0xe74c3c`, 테두리 `0xb03024`)
- 별: 초록 사각형 → **노란 정삼각형** (`0xffd700`, 테두리 `0xd4a900`), `scene.add.triangle`로 직접 그림
- 파일: [games/balloon-stars/main.js](games/balloon-stars/main.js)

### 2. Node 없이 편집·구동 가능한 구조로 전환 (하이브리드 빌드 전략)
**배경**: 이 프로젝트는 기존에 Vite + npm(`import Phaser from "phaser"`) 구조라, Node/npm이 없는 PC에서는
소스를 고쳐도 `dist/`(빌드 결과물)를 다시 만들 수 없어 반영이 안 되는 문제가 있었음. 여러 PC를 오가며
작업할 계획이라 이 문제를 근본적으로 해결함.

**변경 내용**:
- `vendor/phaser-arcade-physics.min.js` 추가 — Phaser 4.2.1의 arcade-physics 전용 경량 UMD 빌드를
  npm 패키지가 아니라 **저장소에 직접 커밋**해둠 (CDN도 아니고 완전 로컬 파일 — 오프라인 요구사항과도 부합)
- [games/balloon-stars/index.html](games/balloon-stars/index.html): Phaser를 `<script src="../../vendor/...">`로 전역 로드,
  CSS도 JS import 대신 `<link rel="stylesheet">`로 전환, `main.js` 경로를 상대경로로 변경
- [games/balloon-stars/main.js](games/balloon-stars/main.js): `import Phaser from "phaser"`와 CSS import 제거
  (전역 `Phaser` 객체 사용). 나머지 상대경로 import(`topbar.js`, `beep.js`)는 그대로 유지
- [index.html](index.html), [src/main.js](src/main.js): 허브 페이지도 동일하게 CSS를 `<link>`로 전환 —
  **사이트 전체를 빌드 없이 소스 그대로 서빙 가능**하게 만듦
- **새 스크립트**: [serve_source.ps1](serve_source.ps1) / [serve_source.bat](serve_source.bat) /
  [serve_source_mac.command](serve_source_mac.command) — `dist`가 아니라 **소스 코드 원본**을
  `http://localhost:8200`으로 서빙 (포트 8100은 기존 `serve.bat` 계열이 `dist`를 서빙하는 데 그대로 사용 중)

**검증**: 브라우저 프리뷰로 소스에서 바로 게임이 로드되고, 빨간 원/노란 삼각형이 정상 렌더링되며
콘솔 에러가 없음을 확인함. 별 생성 로직도 게임 루프를 수동으로 스텝시켜 정상 동작 확인함
(자동화 프리뷰 창이 백그라운드 탭으로 인식돼 실시간 애니메이션만 안 보였던 것 — 코드 자체는 문제없음).

**⚠️ 미검증 사항**: `npm run build` / `npm run build:local`(Firebase 배포·더블클릭 로컬용 빌드)이
이 구조 변경 후에도 정상 동작하는지는, 이 작업을 진행한 환경에 Node가 없어서 직접 확인하지 못했음.
**Node 있는 PC에서 한 번 빌드를 돌려서 `dist/`, `dist-local/`이 문제없이 생성되는지 확인 필요.**

**Git 상태**: 위 변경 사항들은 아직 **커밋되지 않은 상태**임 (`git status` 기준 수정/신규 파일로 남아있음).
OneDrive 동기화 자체는 git 커밋 여부와 무관하게 파일 단위로 이루어지므로 다른 PC에서도 파일은 보이지만,
여러 PC에서 동시에 손대면 git 히스토리 없이 충돌할 수 있으니 다음 세션에서 커밋 여부를 판단할 것.

### 3. 기존 로컬 서빙 구조 (참고, 오늘 이전부터 있던 것)
- `serve.bat` / `serve.ps1` / `serve_mac.command` (포트 8100): **`dist/`(빌드 결과물)를 서빙**.
  Node 있는 PC에서 실행하면 자동으로 `npm run build`까지 하고 서빙, Node 없는 PC에서는 이미
  OneDrive로 동기화되어 있는 `dist/`를 그대로 서빙 (재빌드 안 함)
- `vite.config.js`: 메인 빌드 설정 (허브 + balloon-stars → `dist/`, Firebase Hosting 배포 대상)
- `vite.config.standalone.balloon-stars.js`: `vite-plugin-singlefile`로 게임 하나를 완전히
  자체 포함된 단일 HTML로 빌드 (`dist-local/`) — 더블클릭으로 오프라인 실행 가능
- `CREDITS.md`: 이미지/사운드 에셋 출처·라이선스 기록용 (현재는 도형/합성음만 써서 기록할 항목 없음)

---

## 전체 빌드 로드맵 (최신판)

### Phase 0 — 실차 검증 (사용자가 직접 확인해야 함)
- Model Y Juniper 2열 스크린에서 `teslagames.web.app` 접속 방법 확인 — **URL 직접 입력해야 하는지,
  즐겨찾기/바로가기로 고정 가능한지** (아이가 스스로 켤 수 있어야 하므로 중요)
- 화면 실제 해상도/가로세로 비율 실측
- 오프라인(에어플레인모드 등) 상태에서 재방문 시 캐시로 뜨는지
- **2개 손가락 동시 터치**(멀티터치)가 잘 인식되는지 — balloon-stars로 테스트 가능

### Phase 1 — 오프라인 PWA 기반 (미착수)
- Web App Manifest + Service Worker로 허브·게임·`vendor/` 에셋 전체 캐싱
- 배포마다 안전하게 캐시 갱신되는 버전 관리 전략
- 정확한 파일 버전 관리가 필요해서 `vite-plugin-pwa` 같은 빌드 도구 활용 예정 (Node PC에서 최종 빌드)
- Lighthouse PWA 감사로 점검

### Phase 2 — 공용 입력 유틸 (탭 + 드래그 + 2인 분할 터치) (미착수)
- `src/shell/`에 스와이프 궤적 추적, 화면 좌/우 분할 멀티터치를 표준화한 공용 모듈 추가
- balloon-stars가 이미 `input: { activePointers: 2 }`로 좌/우 분할 2인 조작을 하고 있음 —
  이 패턴을 공식 표준으로 뽑아내서 재사용

### Phase 3 — Game #2: 과일 슬라이스 (프루츠닌자 스타일) (미착수, 다음 유력 후보)
- balloon-stars의 "위에서 떨어지는 오브젝트 + 화면 밖으로 나가면 제거" 로직 재사용 가능
- 드래그(스와이프) 슬라이스 판정 추가 (아래 레퍼런스 참고)
- 협동 모드(같이 모으기) / 대결 모드(각자 점수 경쟁) 둘 다 화면 좌우 분할로 구현
- 과일도 이미지 대신 벡터 도형(원·타원 + 색)으로

### Phase 4 — Game #3 후보: 새총 발사 (앵그리버드 스타일) (미착수, 더 큰 작업이라 후순위)
- 드래그로 조준·발사하는 물리 기반 게임 — 구조물 쌓기, 발사체 물리 필요
- Phaser의 Arcade Physics 대신 Matter.js 플러그인 전환 검토 필요할 수 있음

### Phase 5 — 배포·유지보수 루틴 정리 (미착수)
- Firebase 배포 전 체크리스트(오프라인 테스트, 실기기 확인) 문서화
- "진실의 원천" 정리: Firebase 배포본이 실제 서비스 대상, OneDrive의 `dist`/`dist-local`은
  Node 없는 PC용 로컬 백업 경로

---

## 오픈소스 레퍼런스 조사 결과

⚠️ **라이선스 주의**: 대부분 LICENSE 파일이 없는 개인 프로젝트 → 기본 저작권 적용, 코드 그대로 복사는
안전하지 않음. **읽고 기법만 참고해서 우리 스타일(벡터 도형, Phaser 4, vendor 구조)로 새로 구현**하는 게 기본 전략.

| 저장소 | 장르/스택 | 라이선스 | 비고 |
|---|---|---|---|
| [hoch98/Slingshot](https://github.com/hoch98/Slingshot) | 슬링샷, Matter.js | MIT | 실제 코드 재사용 안전 |
| [keithfrancisb/Angry-Circles](https://github.com/keithfrancisb/Angry-Circles) | 앵그리버드 클론, 원+삼각형 | **ISC** (package.json에만 명시, GitHub 자동감지는 놓침) | 벡터 도형 스타일과 컨셉이 정확히 일치. 실행 방법 아래 참고 |
| [asafmor/phaser-fruit-ninja](https://github.com/asafmor/phaser-fruit-ninja) | 프루츠닌자, Phaser 2.6.2 | 없음 | 스와이프 판정 로직 구조만 참고 |
| [MehmetFaahem/fruit-ninja](https://github.com/MehmetFaahem/fruit-ninja) | 프루츠닌자, Phaser | 없음 | 목숨/폭탄 룰 참고 |
| [emjose/slingshot](https://github.com/emjose/slingshot) | 슬링샷, Matter.js | 없음 | 발사 메커니즘 참고 |
| [linkzy/adfree-kids-games](https://github.com/linkzy/adfree-kids-games) | 허브 구조 (2-6세, 광고없음, PWA) | 없음 | 허브/오프라인 구조 설계 참고, Phase 1에 도움될 듯 |
| [michelpereira/awesome-open-source-games](https://github.com/michelpereira/awesome-open-source-games) | 오픈소스 게임 링크 모음 (3천+ 스타, 활발) | CC0 | 더 둘러볼 인덱스 |

### Angry-Circles 실행 방법 (확인 완료)
- **바로 플레이**: https://keithfrancisb.github.io/Angry-Circles/ (GitHub Pages 배포됨)
- **로컬 실행**: `dist/main.js`가 이미 빌드되어 커밋돼 있어서, ZIP 다운로드 후 `index.html`을
  더블클릭만 해도 바로 동작 (Node 불필요, `file://`로도 문제없음 — ES 모듈이 아니라 일반 `<script src>`라서)
- **소스 수정하며 개발**: `npm install` → `npx webpack` (package.json에 별도 `build`/`start` 스크립트는 없음)
- 조작: 왼쪽 원을 드래그해서 당겼다 놓으면 발사, 오른쪽 삼각형 더미를 4번 안에 쓰러뜨리면 다음 레벨
  → 지금 난이도/속도는 5·7세엔 다소 빠름. 우리 버전은 판정을 훨씬 느슨하게 조정할 것

---

## 다음 액션 (미결 사항)

1. **[사용자] Phase 0 실차 검증** — Model Y Juniper 2열 스크린에서 위 체크리스트 확인
2. **[사용자] Node 있는 PC에서 `npm run build` / `npm run build:local` 한 번 확인** — 오늘 구조 변경 후
   정상적으로 빌드되는지 (아직 미검증)
3. **[결정 필요] git 커밋 여부** — 현재 변경 사항들이 아직 커밋 안 된 상태. 여러 PC를 오가기 전에
   커밋해두는 게 안전할 수 있음
4. **[다음 작업 후보]** Phase 1(오프라인 PWA) 또는 Phase 2(탭+드래그 공용 입력 유틸) 중 무엇부터
   시작할지 — 대화 마지막 시점까지 미결정
