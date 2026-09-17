# 이명욱 / Robot Software Developer

로봇 소프트웨어와 임베디드 프로젝트를 소개하는 개인 포트폴리오입니다. STM32 펌웨어, ROS 2 로봇 통합, 센서, 모터 제어와 다중 로봇 FMS 개발 경험을 담았습니다.

## Projects

| 프로젝트 | 담당 내용 | 기술 |
|---|---|---|
| AX Logistics MultiBot | FMS ↔ ROS 2 통신, 상태 연동 | ROS 2 Jazzy, Zenoh, Nav2 |
| GoSung | STM32 펌웨어, ROS 2 센서, 제어 연동 | STM32F407, FreeRTOS, ROS 2 Humble |
| AIMing Project | 추론 파이프라인, FreeRTOS 태스크, 하드웨어 통합 | STM32H743, DCMI/DMA, TFLite |
| Tracking Patrol Robot | 인식 결과 기반 트래킹 로직, 제어 연동 | Raspberry Pi 5, STM32F407, Python |
| VIP Wearable | IMU, 햅틱 제어, Bluetooth, Android 연동 | RFCOMM, lgpio, Android Java |
| PLC Mini Project | PLC 시퀀스와 HMI 공동 구현 | GX Works2, Ladder, HMI |

각 프로젝트 페이지에서 시스템 구성, 담당 역할, 구현 내용과 문제 해결 과정을 확인할 수 있습니다.

## Local preview

별도 패키지 설치 없이 정적 파일로 동작합니다.

```sh
python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## Content update

- 프로젝트 내용: `content/projects.json`
- 이름, GitHub, 이메일: `content/profile.json`
- 페이지 템플릿: `scripts/build.py`
- 공통 스타일: `style.css`
- 메뉴와 필터: `script.js`

콘텐츠를 수정한 뒤 페이지를 다시 생성합니다.

```sh
python scripts/build.py
```

`index.html`과 `projects/*.html`은 생성 결과이므로 템플릿과 JSON을 먼저 수정합니다.

## Structure

```text
assets/                   # 프로필, 프로젝트 이미지와 아이콘
content/                  # 프로젝트, 프로필 데이터
projects/                 # 프로젝트 상세 페이지
scripts/build.py          # 정적 HTML 생성
scripts/check-browser.cjs # 반응형, 링크 브라우저 검사
index.html                # 포트폴리오 홈
style.css                 # 공통 스타일과 반응형 레이아웃
script.js                 # 메뉴와 프로젝트 필터
```

## Deployment

GitHub Pages용 사용자 사이트 저장소입니다. `main` 브랜치의 루트 디렉터리를 Pages 소스로 사용하면 `https://ugie01.github.io`에서 서비스할 수 있습니다.

## Browser support

280px 소형 화면부터 1920px 데스크톱까지 반응형으로 구성했습니다. 키보드 포커스, skip link, 이미지 대체 텍스트와 reduced motion 설정을 포함합니다.
