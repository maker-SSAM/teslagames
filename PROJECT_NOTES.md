# 테슬라 뒷좌석 게임 — 프로젝트 노트 (진행 기록)

마지막 갱신: 2026-09-30

이 문서는 여러 PC와 여러 대화(세션)를 오가며 작업을 이어가기 위한 **진행 기록**입니다.
- **무엇을 어떤 순서로 할지** → [ROADMAP.md](ROADMAP.md)
- **AI가 따를 규칙** → [CLAUDE.md](CLAUDE.md)
- **지금 어디까지 왔는지, 무엇을 결정했는지** → 이 문서

---

## ⭐ 현재 상태 한눈에

| 항목 | 내용 |
|---|---|
| 현재 단계 | **Stage 0 — 시작 전** (Godot 미설치) |
| 바로 다음 할 일 | **맥북에** Godot 4.7.x (Standard) 설치 → `teslagames/godot/` 에 프로젝트 만들기 ([ROADMAP Stage 0](ROADMAP.md#stage-0--준비-godot과-첫-만남)) |
| 세션 명령어 | 시작 `/시작`, 마무리 `/끝` |
| 언제든 해 둘 일 | 🚗 차에서 뒷좌석 화면으로 `teslagames.web.app` 열어 보기 (아래 "위험 요소" 1번) |
| 배포 중인 사이트 | https://teslagames.web.app — 아직 **옛 Phaser 버전** (Stage 1에서 Godot으로 교체 예정) |

---

## 프로젝트 한 줄 요약

테슬라 **Model Y Juniper 뒷좌석 화면**에서 5~7세(한국 나이) 두 아이가 광고 없이 할 수 있는 **오프라인 터치 게임 모음**을,
사용자가 **Godot을 직접 배우면서** AI와 함께 천천히 만드는 개인 프로젝트.

- 배포 주소: https://teslagames.web.app (Firebase Hosting, 프로젝트 ID `teslagames`)
- 저장소: 이 폴더 (`teslagames`), OneDrive로 여러 PC에 동기화 + git
- Git 사용자: `maker-SSAM`

---

## 확정된 요구사항

| 항목 | 내용 |
|---|---|
| 실행 화면 | 테슬라 Model Y Juniper **뒷좌석 화면**이 메인. 뒷좌석 거치 태블릿은 보조 (Plan B) |
| 대상 | 한국 나이 5세·7세 (만 4세·6세). 글을 잘 못 읽음 |
| 광고·온라인 | 광고, 댓글, 계정, 온라인 순위표 **일체 없음** |
| 오프라인 | **필수** — 터널·시골길에서 인터넷이 끊겨도 동작 |
| 조작 | **탭 또는 드래그(스와이프)만** |
| 인원 | 2인용 선호. **1인용도 가능.** 2인용은 **동시** 또는 **번갈아** 둘 다 가능 (2026-09-30 완화) |
| 난이도 | 낮게. "절대 지지 않는 게임"일 필요는 없음 |
| 레퍼런스 | 유명 게임(앵그리버드, 프루츠닌자 등)을 참고하되 **난이도를 낮춰** 차용 |
| 비주얼 | 이모지·이미지 대신 **코드로 그린 단순 도형** + 선명한 색 |
| 제작 방식 | **사용자가 Godot을 처음부터 배우면서** 함께 만든다. AI가 결과만 주는 방식이 아님 (2026-09-30) |
| 시간 감각 | 아이들이 크면 개인 기기로 넘어갈 수 있음 → 인프라에 너무 오래 매달리지 말고 **실제로 노는 게임을 비교적 빨리** |

---

## 결정 기록 (Decision Log)

최신 결정이 위에 옵니다. 결정을 뒤집을 때는 지우지 말고 새 항목을 추가합니다.

### 2026-09-30 — 주 작업기는 맥북, 세션 명령어는 한글로
- **주 작업기: 맥북 M2 Pro** (학교·집에 들고 다님). 윈도우 PC(학교·집)는 필요할 때 잠깐씩만 사용
- 웹 내보내기와 Firebase 배포는 **맥북에서만** 한다 (내보내기 템플릿과 Firebase CLI를 맥북에만 설치)
- 모든 기기에서 OneDrive의 `teslagames` 폴더는 **"항상 이 기기에 유지"** 로 설정
- 세션 명령어: **`/시작`**(= `/lesson-start`), **`/끝`**(= `/lesson-end`). 한글 이름이 메뉴에 안 보이면 영어 이름으로 실행

### 2026-09-30 — 엔진을 Phaser에서 Godot으로 전환, 계획 전면 재수립
- **결정**: Godot 4.7.x (Standard, GDScript, Compatibility 렌더러)로 새로 만든다. 단계별 계획은 [ROADMAP.md](ROADMAP.md)
- **이유**:
  1. 사용자가 **과정을 배우면서** 만들고 싶어 함 → 시각적 에디터가 있는 Godot이 학습에 적합
  2. Godot은 Node/npm이 필요 없어, 여러 PC를 오갈 때 생기던 빌드 문제가 사라짐
  3. 웹 내보내기·PWA·2D 물리가 모두 내장
- **엔진 이력**: KAPLAY → Phaser 4 → **Godot** (세 번째). 차에서 아예 동작하지 않는 수준의 문제가 없는 한 **다시 바꾸지 않는다**
- **옛 Phaser 코드**: 지우지 않고 그대로 둔다 (`games/`, `src/`, `vendor/`, `index.html`, vite 설정, serve 스크립트).
  Stage 1에서 배포 대상이 Godot으로 바뀌고, Stage 5에서 `legacy/`로 옮길지 지울지 사용자가 결정
- **한 프로젝트 원칙**: 허브와 모든 게임을 **하나의 Godot 프로젝트**에 넣는다 (한 번 로딩하면 모든 게임을 오프라인으로 쓸 수 있음)
- **진행 방식**: 세션 시작은 `/시작`, 마무리는 `/끝` 스킬 사용 (영어 이름 `/lesson-start`, `/lesson-end`도 동작). 사용자는 이후 비용 절감을 위해 가벼운 모델을 쓸 예정 → 문서만 보고 이어갈 수 있게 구체적으로 작성함

### 2026-09-10 — Node 없이 편집 가능한 구조 (Phaser 시절, 이제는 참고용)
- Phaser를 `vendor/`에 직접 넣고 `<script>`로 불러와 빌드 없이 소스를 바로 서빙하도록 바꿨음
- Godot 전환으로 이 문제 자체가 사라짐

---

## 위험 요소 & 미확인 사항

| # | 내용 | 영향 | 확인 방법·시점 | 결과 |
|---|---|---|---|---|
| 1 | **뒷좌석 화면에는 일반 웹 브라우저가 없다**는 보도 (2026-01). 우회 경로: Theater → YouTube → 나침반 아이콘 → 개인정보처리방침 → Google → 주소 입력 ([출처](https://www.notateslaapp.com/news/3503/how-to-hack-tesla-rear-screen-to-watch-any-video-streaming-appsservices)) | **프로젝트 전체.** 안 되면 Plan B(태블릿) | 지금 당장 기존 사이트로 확인 가능 / Stage 1 관문 | ⬜ 미확인 |
| 2 | 우회 경로는 들어가는 길 자체가 인터넷을 필요로 할 수 있음 → 완전 오프라인 상태에서 새로 켜기는 어려울 수 있음 | 오프라인 요구 | Stage 1·5. 운영 팁: 출발 전·터널 전에 미리 켜 두기 | ⬜ 미확인 |
| 3 | Godot 웹 게임은 첫 로딩 용량이 큼 (수십 MB, 압축 전송 시 줄어듦) | 첫 로딩 시간 | Stage 1에서 실측 | ⬜ 미확인 |
| 4 | 뒷좌석 브라우저의 WebGL 2.0·WebAssembly 지원 여부 | 실행 가능 여부 | Stage 1 | ⬜ 미확인 |
| 5 | 뒷좌석 화면의 실제 해상도·비율 | 화면 설계 | Stage 1 (화면에 크기 표시) | ⬜ 미확인 |
| 6 | 두 손가락 동시 터치(멀티터치) 인식 | 동시 2인 게임 | Stage 2 (터치 테스터) | ⬜ 미확인 |
| 7 | 소리가 어디로 나오는지 (차 스피커 / 블루투스) | 소리 설계 | Stage 2 | ⬜ 미확인 |
| 8 | 웹에서 한글 글꼴이 □로 깨짐 | 글자 사용 | 글자를 안 쓰는 것이 원칙. 필요하면 Noto Sans KR 추가 | 알려진 문제 |
| 9 | 폴더 경로에 한글·공백 포함 (`OneDrive - 덕치초등학교\바탕 화면\...`) | 도구 오류 가능성 | 문제가 생기면 그때 대응 | 관찰 중 |

---

## PC별 환경

| 기기 | 역할 | Godot (버전·경로) | 내보내기 템플릿 | Firebase CLI | 메모 |
|---|---|---|---|---|---|
| **맥북 M2 Pro** | **주 작업기** (학교·집에 들고 다님). 내보내기·배포 담당 | ⬜ 미설치 (`/Applications/Godot.app` 예정) | ⬜ | ⬜ 미설치 | 저장소 경로 기록 필요 (보통 `~/Library/CloudStorage/OneDrive-…/`) |
| 윈도우 PC A | 보조 (가끔 짧게) | ⬜ 미설치 (`C:\Godot\` 예정) | 불필요 | 15.30.2 (Node v24.19.0) | 2026-09-30 계획 세션을 한 PC. 학교/집 중 어느 쪽인지 확인 필요 |
| 윈도우 PC B | 보조 (가끔 짧게) | ⬜ | 불필요 | ? | 학교/집 중 나머지 하나 |

> - **모든 기기의 Godot 버전은 같아야 합니다.** 윈도우 PC는 에디터에서 실행(F5/F6)과 코드 수정만 하므로 내보내기 템플릿이 필요 없습니다.
> - 맥북에 Firebase CLI를 설치하는 것은 Stage 1에서 합니다 (Node 없이 설치하는 단독 실행 파일 방식도 있음).

---

## 🚗 차 테스트 기록

> 날짜, 소프트웨어 버전(알면), 무엇을 테스트했는지, 결과를 적습니다.

_(아직 없음)_

---

## 👧👦 아이 관찰 기록

> 게임을 해 본 뒤 재미있어한 점, 어려워한 점, 싸웠는지, 다시 하자고 했는지 등을 적습니다. 튜닝과 다음 게임을 고를 때 가장 중요한 자료입니다.

_(아직 없음)_

---

## 세션 기록 (최신이 위)

### 2026-09-30 — 계획 재수립 (고성능 모델 세션)
- 목표 재확인: 목표는 기존과 같음. 1인용·번갈아 하기 허용으로 완화
- 사용자 배경: Godot 경험 없음, 블록 코딩 약간, AI와 함께 OpenSCAD 프로젝트를 해 본 경험 있음
- 결정: Godot으로 전환하고, **배우면서 함께 만드는** 방식으로 진행
- 조사: Godot 최신 안정판 4.7.2 (2026-08), 웹 내보내기는 Compatibility 렌더러·WebGL 2.0 필요, 기본값은 싱글 스레드(특수 서버 헤더 불필요), PWA 옵션 내장.
  **뒷좌석 화면에는 일반 브라우저가 없다는 보도**를 발견해 위험 요소 1번으로 등록
- 만든 문서: [ROADMAP.md](ROADMAP.md) (새로 작성), [CLAUDE.md](CLAUDE.md) (Godot 기준으로 다시 작성), 이 문서 (재구성),
  `.claude/skills/lesson-start`, `.claude/skills/lesson-end` (세션 시작·마무리 절차, 명령어는 `/시작`, `/끝`)
- `.gitignore`에 `.godot/`, `export/` 추가
- 작업 환경 결정: **맥북 M2 Pro가 주 작업기**, 윈도우 PC는 보조. 내보내기·배포는 맥북에서만
- 다음: Stage 0 (맥북에 Godot 설치)

### 2026-09-10 이전 — Phaser 시절 요약
- Vite + KAPLAY로 시작 → Phaser 4로 전환 → Firebase Hosting 배포 (`teslagames.web.app`)
- 게임 1개: **별 모으기 열기구** (`games/balloon-stars/`). 좌우 탭으로 풍선 2개 점프, 떨어지는 별 모으기, 둘이 합쳐 20개면 승리 (협동).
  이 게임의 규칙은 Stage 3에서 Godot으로 다시 만들 때 그대로 참고 ([ROADMAP Stage 3](ROADMAP.md#stage-3--첫-게임-별-모으기-열기구-phaser-버전-다시-만들기))
- 공용 셸(`src/shell/`): 상단바(소리·음량·홈 버튼), 전체화면 "탭해서 시작" 게이트, 합성 효과음
- 알려진 문제 (Phaser 빌드, 더는 고치지 않음): `npm run build` 결과물에 `vendor/phaser-arcade-physics.min.js`가 복사되지 않음

---

## 참고 오픈소스 저장소

⚠️ **라이선스 주의**: 대부분 LICENSE 파일이 없는 개인 프로젝트라 기본 저작권이 적용됩니다. 게다가 모두 JavaScript라 Godot에 그대로 쓸 수 없습니다.
→ **규칙과 느낌만 참고**하고, 코드는 우리 방식(Godot, 벡터 도형)으로 새로 작성합니다.

| 저장소 | 장르 | 라이선스 | 참고할 점 |
|---|---|---|---|
| [keithfrancisb/Angry-Circles](https://github.com/keithfrancisb/Angry-Circles) | 앵그리버드 클론 (원+삼각형) | ISC | 벡터 도형 스타일이 우리와 같음. [바로 플레이](https://keithfrancisb.github.io/Angry-Circles/) — 5·7세에겐 빠름 |
| [hoch98/Slingshot](https://github.com/hoch98/Slingshot) | 새총 | MIT | 발사 메커니즘 |
| [emjose/slingshot](https://github.com/emjose/slingshot) | 새총 | 없음 | 발사 메커니즘 (아이디어만) |
| [asafmor/phaser-fruit-ninja](https://github.com/asafmor/phaser-fruit-ninja) | 프루츠닌자 | 없음 | 스와이프 판정 구조 (아이디어만) |
| [MehmetFaahem/fruit-ninja](https://github.com/MehmetFaahem/fruit-ninja) | 프루츠닌자 | 없음 | 규칙 참고 (우리는 폭탄·목숨 없음) |
| [linkzy/adfree-kids-games](https://github.com/linkzy/adfree-kids-games) | 광고 없는 유아 게임 허브 (PWA) | 없음 | 허브 구성·게임 아이디어 |
| [michelpereira/awesome-open-source-games](https://github.com/michelpereira/awesome-open-source-games) | 오픈소스 게임 목록 | CC0 | 아이디어 찾기 |

Godot 학습 자료:
- 공식 문서 (한국어 일부 번역: 주소의 `/en/`을 `/ko/`로): https://docs.godotengine.org/en/stable/
- 공식 첫 2D 게임 튜토리얼: https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html
