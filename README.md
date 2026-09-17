# 이명욱 · Robot Software / Embedded Portfolio

STM32 기반 하위 제어에서 ROS 2와 다중 로봇 FMS까지, 실제 프로젝트의 역할·구현·한계를 정리한 GitHub Pages용 정적 포트폴리오입니다.

**현재 상태: 로컬 작성 및 검증 완료, 사용자 검토 대기. 이 작업에서는 commit·push·배포를 실행하지 않았습니다.**

예정 주소: [ugie01.github.io](https://ugie01.github.io/). 원격 사이트가 현재 로컬 결과와 같다는 뜻은 아닙니다.

## 프로젝트

| 프로젝트 | 중심 경험 | 페이지 |
|---|---|---|
| AX Logistics MultiBot | ROS 2 Jazzy·Zenoh 통신, FMS 상태 연동, 진행 중 | [상세](projects/fms.html) |
| GoSung | STM32·FreeRTOS·ROS 2 센서/구동 통합 | [상세](projects/gosung.html) |
| AIMing Project | STM32H743 영상 입력·기존 모델 추론·제어 태스크 | [상세](projects/aiming.html) |
| Tracking Patrol Robot | 트래킹 주담당, STM32·PID 일부 구현 지원, 4인 팀 | [상세](projects/tracking.html) |
| VIP Wearable | RFCOMM·IMU·햅틱·Android 앱 | [상세](projects/vip.html) |
| PLC Mini Project | 교육용 PLC 시퀀스·HMI 공동 구현 | [상세](projects/plc.html) |

각 상세 페이지는 PROJECT OVERVIEW, MY ROLE, MY IMPLEMENTATION, TEAM / EXTERNAL, 시스템 구성도, 문제 해결, 결과와 한계를 분리합니다. FMS의 통신·연동 구현과 자동 배차·교통관리·OMX·VLM 계획도 구분합니다. 모델 학습·기존 드라이버·외부 패키지는 본인 독자 개발로 표현하지 않습니다.

## 로컬에서 보기

설치나 빌드 없이 `index.html`을 브라우저에서 열어도 동작합니다. 상세 페이지·필터·메뉴에 별도 서버 API가 없습니다. HTTP 미리보기 권장 방법:

```sh
cd Ugie01.github.io
python -m http.server 4173 --bind 127.0.0.1
```

[로컬 미리보기](http://127.0.0.1:4173)에서 확인합니다. 중지는 서버 터미널에서 `Ctrl+C`.

## 구조

```text
index.html                    # 메인 페이지 (생성된 정적 HTML)
projects/*.html               # 프로젝트별 상세 6개
style.css                     # 공통 스타일과 반응형
script.js                     # 메뉴·프로젝트 분야 필터
404.html                      # 없는 주소 안내
assets/favicon.svg
assets/projects/*             # 사진·대표 프레임·구성도 12개
content/profile.json          # 이름·GitHub·공개 이메일
content/projects.json         # 프로젝트별 콘텐츠의 원본
scripts/build.py              # Python 표준 라이브러리만으로 HTML 생성
scripts/check-browser.cjs     # 선택 사항: Playwright 검증
docs/fact-check.md            # 사실 확인·기여 범위·불확실성
docs/assets.md                # 자산·영상·라이브러리 출처
docs/responsive-test.md       # 검증 환경·범위·결과
.nojekyll                     # GitHub Pages에서 그대로 서비스
.gitignore                    # 로컬 검증 산출물 제외
```

## 수정

1. 프로젝트 설명·역할·기간·링크: `content/projects.json`을 수정합니다.
2. 연락처: `content/profile.json`의 `email`에 공개할 주소를 입력합니다. 빈 문자열이면 Email 버튼을 표시하지 않습니다.
3. 홈의 소개·교육·스킬 및 공통 HTML: `scripts/build.py`를 수정합니다.
4. 스타일·메뉴 동작: `style.css`, `script.js`를 수정합니다.
5. HTML을 다시 생성합니다.

```sh
python scripts/build.py
```

생성된 `index.html`, `projects/*.html`도 함께 반영해야 합니다. 직접 HTML만 편집하면 다음 생성 때 덮어쓰므로 원본 콘텐츠 또는 템플릿에서 수정하세요.

이미지는 `assets/projects/`에 추가하고 JSON의 `images`에서 파일명·대체 텍스트·캡션을 지정합니다. 현재 사진은 종횡비를 유지하는 `object-fit: contain`으로 표시합니다. 성능 수치는 코드 설정값과 실측 결과를 구분하고 시험 조건·로그가 있을 때 추가합니다.

## GitHub Pages 배포 — 승인 후 진행

이 저장소는 기존 `Ugie01/ugie01.github.io`의 정적 사이트 구조를 유지합니다. 별도 Vite base 설정, Node 빌드, 백엔드, 클라이언트 라우터가 필요하지 않습니다. 모든 리소스와 상세 링크는 상대 경로이며 상세 URL 새로고침도 직접 HTML로 처리됩니다.

사용자가 로컬 사이트를 확인하고 **push를 승인한 다음에만** 다음 절차를 진행합니다.

1. 변경 파일과 콘텐츠를 검토하고 승인된 파일을 commit·push합니다. `.local-preview/`와 원본 개인 회고·대용량 영상은 포함하지 않습니다.
2. 저장소 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, `main`, `/ (root)`를 선택합니다. 기존 설정이 있으면 먼저 확인합니다.
3. 배포 완료 후 홈·상세 직접 진입·모바일 메뉴·이미지·외부 링크와 없는 주소의 404 화면을 확인합니다.

이미 HTML이 완성된 형태이므로 별도 GitHub Actions Workflow는 추가하지 않았습니다. Pages 설정 변경과 실제 배포는 아직 수행하지 않았습니다. 다른 이름의 프로젝트 저장소로 옮길 때 일반 페이지의 상대 경로는 유지되지만 `404.html`의 홈 링크는 새 배포 주소로 바꿔야 합니다.

## 검증

- 320 / 375 / 390 / 430 / 768 / 1024 / 1440px에서 홈·상세 6개, **49개 조합 통과**.
- 가로 넘침, 텍스트 잘림, 이미지 누락, 주요 버튼 겹침 없음.
- 모바일 메뉴, Escape 닫기, 분야 필터, 내부 링크·앵커, JS 비활성 접근 확인.
- 시스템 구성도는 외부 Mermaid 런타임 없이 HTML/CSS 및 SVG로 표시합니다.
- 주요 버튼 최소 44px, 키보드 focus 표시, skip link, 이미지 alt, reduced-motion 대응.
- 원본 비율을 유지한 프로젝트 자산 합계 약 0.96MB. 외부 폰트·CDN·추적 스크립트 없음.

실제 환경과 제한은 [반응형 검증 기록](docs/responsive-test.md)을 참고하세요. Playwright가 있는 테스트 환경에서는 로컬 서버 실행 후 `node scripts/check-browser.cjs`로 재현할 수 있습니다. 하드웨어 프로젝트 자체를 재실행하거나 성능을 검증한 것은 아닙니다.

## 콘텐츠 근거와 남은 입력

- [프로젝트 사실 확인표](docs/fact-check.md): 코드·문서·사용자 회고 교차 검증, 외부/팀 기여, 과장 위험과 확인 사항.
- [이미지·영상 출처](docs/assets.md): 원본 경로, 영상 프레임, FMS 도식의 의미, 사용 라이브러리.
- Tracking은 사용자가 4인 팀과 트래킹 주담당·STM32/PID 일부 지원을 확인했습니다.
- 공개 이메일, FMS 정확한 시작일, PLC 정확한 기간은 미확인이라 임의 입력하지 않았습니다.
- FMS와 PLC의 공개 Demo URL은 미등록 상태입니다. GoSung·AIMing·Tracking·VIP는 원본 README에 등록된 YouTube로 연결합니다.

프로젝트 이미지·영상은 팀 자료를 포함합니다. 외부 오픈소스의 권리를 이 사이트의 권리로 재정의하지 않으며, 원본 프로젝트의 라이선스와 저작권 표기를 따릅니다.
