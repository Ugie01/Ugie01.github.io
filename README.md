<h1 align="center">👋 이명욱 | Robot SW & Embedded</h1>

<p align="center">STM32 펌웨어, ROS 2 센서 처리, 모바일 제어 앱을 연결해 로봇의 실제 동작을 구현해 왔습니다.</p>
<p align="center"><strong>관심 직무:</strong> AMR·자율주행 로봇 SW · 로봇 시스템 통합</p>

<p align="center">
  <img alt="ROS 2" src="https://img.shields.io/badge/ROS%202-22314E?style=flat-square&logo=ros&logoColor=white">
  <img alt="STM32" src="https://img.shields.io/badge/STM32-03234B?style=flat-square&logo=stmicroelectronics&logoColor=white">
  <img alt="FreeRTOS" src="https://img.shields.io/badge/FreeRTOS-4479A1?style=flat-square">
  <img alt="Android" src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white">
</p>

---

## 👨‍💻 About Me

센서와 모터를 제어하는 코드부터 로봇의 데이터를 확인하고 명령을 보내는 앱까지 만들어 봤습니다. 여러 장치가 연결될 때 생기는 문제를 직접 확인하고, 필요한 부분을 고쳐 다시 시험하는 일을 좋아합니다. 최근에는 성능 측정과 개발 과정 기록을 더 꾸준히 남기기 위해 Git·GitHub, Jira, Confluence를 배우고 있습니다.

| 기간 | 학력·활동 | 내용 |
| --- | --- | --- |
| 2026.04~현재 | 대한상공회의소 서울기술교육센터 | AI 융합 로봇 SW 개발자 3기 수강 중 · 2026.11.09 종료 예정 |
| 2026.02 | 인덕대학교 정보통신공학과 | 전공심화 졸업 · 4.5/4.5 |
| 2025.02 | 인덕대학교 컴퓨터전자공학과 | 졸업 · 4.45/4.5 |
| 2022.09~2024.12 | 인덕대학교 ICT 학과 동아리 | 회장 · 스터디 운영과 프로젝트 일정 조율 |

**자격:** 정보처리기사(2025.09) · 자동차운전면허 1종 보통(2020.10)

## 🛠 Tech Stack

| 구분 | 프로젝트에서 사용한 기술 |
| --- | --- |
| 언어 | `C` `C++` `Python` `Java` `Dart` |
| 로봇·임베디드 | `ROS 2 Humble/Jazzy` `STM32F407/H743` `STM32 HAL` `FreeRTOS` `UART` `I²C` `DMA` `Timer/PWM` |
| 센서·제어 | `2D LiDAR` `카메라` `IMU` `GPS` `초음파` `DC/BLDC/서보모터` |
| 앱·통신 | `Android` `Flutter` `Bluetooth Classic` `BLE` `TMAP` `Firebase` |
| 패키지 적용 경험 | `Nav2` `SLAM Toolbox` `AMCL` `OpenCV` |
| 학습·기록 중 | `Zenoh` `Git` `GitHub` `Jira` `Confluence` |

Nav2·SLAM·AMCL은 기존 패키지를 사용·설정해 본 경험입니다. 내부 경로 계획 알고리즘이나 AI 모델 학습을 직접 개발한 경험으로 소개하지 않습니다.

---

## 📂 대표 프로젝트

### 🚚 물류로봇·다중 로봇 관제 FMS — 진행 중

`2026~현재` · `ROS 2 Jazzy` `Nav2 Route Server` `Zenoh` `FastAPI`

- **목표:** 여러 로봇의 상태와 이동 경로를 한곳에서 확인하고 물류 작업을 배차하는 관제 시스템을 개발하고 있습니다.
- **내 작업:** FMS 백엔드의 라우터·서비스 구조, GeoJSON 루트 그래프 처리, Zenoh 로봇 통신과 프론트엔드 연동을 개발 브랜치에서 작업했습니다. 로봇 측 코드는 팀의 AMR 저장소에서 별도로 관리합니다.
- **진행 중인 부분:** 주문 배차, 로봇 간 교통 관리, OMX 로봇팔 연계, VLM 방식 비교는 구현·검증 단계에 따라 추후 기록하겠습니다.
- **코드:** [FMS 저장소](https://github.com/E1I6-Logistics/Logistics_FMS) · [내 FMS 개발 브랜치](https://github.com/E1I6-Logistics/Logistics_FMS/tree/ugie-fms) · [AMR 저장소](https://github.com/E1I6-Logistics/Logistics_AMR). 현재 기본 브랜치는 작업 내용이 충분히 반영되지 않아 개발 브랜치를 함께 연결했습니다.

### 🦯 [VIP Wearable](https://github.com/Ugie01/2026ESWContest_free_VIPWEARABLE)

`2026.07~08` · `2명` · `Android/Java` `Bluetooth RFCOMM` `IMU` `TMAP`

- **개요:** 음성 길안내와 센서·진동 피드백을 연결한 시각장애인 보행 보조 시스템입니다.
- **내 역할:** Android 내비게이션·오디오 기능, 스마트폰과 라즈베리파이 간 통신, IMU 파싱·낙상 감지 상태 머신, 진동 모터 구동을 맡았습니다. 비전 AI 모델은 다른 팀원 담당입니다.
- **결과와 남은 문제:** BLE 연결 문제 때문에 Bluetooth Classic으로 전환했습니다. 위치 추정은 해결하지 못했고, 연결이 끊겼을 때의 자동 복구도 보완이 필요합니다.
- **코드·영상:** [저장소](https://github.com/Ugie01/2026ESWContest_free_VIPWEARABLE) · [시연 영상](https://youtu.be/4h71w1IgXRw)

### 📷 [AIMing Project](https://github.com/Ugie01/AIMing_Project)

`2026.07~08` · `4명` · `STM32H7` `FreeRTOS` `DMA` `OV2640`

- **개요:** 카메라 입력, 온디바이스 추론, 장치 제어를 STM32H7 보드에서 연결한 프로젝트입니다.
- **내 역할:** 보드 선정, 공개 코드를 참고한 카메라·디스플레이·서보 연동, FreeRTOS 태스크와 DMA 기반 영상 처리 흐름을 맡았습니다. 모델 학습은 개인 담당 범위에 포함하지 않습니다.
- **기술적 판단:** 카메라 설정을 바꿔 약 14~15 FPS를 시험했지만 영상에 파란 노이즈가 생겼습니다. 최종 시연에는 안정적으로 동작한 약 7 FPS 설정을 사용했습니다.
- **코드·영상:** [저장소](https://github.com/Ugie01/AIMing_Project) · [시연 영상](https://www.youtube.com/watch?v=Eg0nYeOGCXA)

### 🤖 [온디바이스 AI 트래킹 순찰 로봇](https://github.com/Ugie01/Tracking_Patrol_Robot)

`2026.05` · `7명` · `Raspberry Pi 5` `STM32F407` `Flutter` `Bluetooth Classic`

- **개요:** 영상 분석 결과에 따라 대상을 추적하고, 앱에서 상태를 확인하거나 수동 제어하는 팀 프로젝트입니다.
- **내 역할:** 전체 시스템 연결 구조, STM32 펌웨어·통신 인터페이스, Bluetooth 상태 수신·조이스틱 조종·PID 게인 설정을 위한 Flutter 앱을 맡았습니다. AI 모델 학습과 모터 PID 구현은 다른 팀원 담당입니다.
- **결과와 남은 문제:** 낙상·위험 행동을 구분하는 시연을 했지만 손 흔들기 등에도 오탐이 있었습니다. 분류 정확도와 주행 성능은 동일 조건의 수치로 검증하지 못했습니다.
- **코드·영상:** [저장소](https://github.com/Ugie01/Tracking_Patrol_Robot) · [시연 영상](https://www.youtube.com/watch?v=0Xhue5Aivyg)

### 🚚 실외 자율주행 배달로봇 GoSung

`2024.04~12` · `6명` · `ROS 2 Humble` `STM32F407` `FreeRTOS` `2D LiDAR` `카메라`

- **개요:** STM32 센서·구동부, ROS 2 제어부, Android 앱을 연결한 실외 배달로봇 프로젝트입니다.
- **내 역할:** IMU·GPS 데이터 파싱, BLDC 모터 제어와 초음파 비상정지, 카메라 객체 영역을 이용한 LiDAR 데이터 필터링, 앱의 위치 표시·수동 제어 기능을 맡았습니다.
- **결과와 남은 문제:** 경사로 정지 보정은 동작했지만 실외 급가속 문제는 해결하지 못했습니다. 당시 센서 시간 동기화는 없었으며, 이를 다룬 후속 개인 실험은 아래에 따로 정리했습니다.
- **코드·영상:** [GoSung 통합 저장소](https://github.com/Ugie01/GoSung) · [시연 영상](https://www.youtube.com/watch?v=ovQ-Pq1NfFU)

## 🧪 개인 도구·기술 실험

이 두 저장소는 팀 프로젝트의 성과와 분리해, 직접 만들어 보고 사용한 방법을 중심으로 정리합니다.

| 저장소 | 무엇을 해볼 수 있나 |
| --- | --- |
| [ROS2_Controller](https://github.com/Ugie01/ROS2_Controller) | Android 앱에서 로봇의 영상·LiDAR 데이터를 보고 이동·설정 명령을 보내는 방법. SLAM·Nav2는 로봇의 기존 기능을 사용합니다. |
| [SensorFusion](https://github.com/Ugie01/SensorFusion) | 카메라·LiDAR 토픽을 시간 동기화하고 인식 객체와 거리 정보를 연결하는 방법. GoSung 이후 별도로 다시 구현했습니다. |

<details>
<summary><strong>이전 프로젝트</strong></summary>

<br>

| 프로젝트 | 직접 맡은 일과 결과 |
| --- | --- |
| 실외 배달로봇 v1 (2023) | STM32F407 모터 구동, 초음파 비상정지, Bluetooth 수동 제어 로직 구현. 목표였던 실외 자율주행은 완성하지 못했고 센서·ROS 2 구성을 v2에서 보완했습니다. |
| 시각장애인을 위한 마트 길찾기 로봇 (2024) | UWB 삼변측량과 `robot_localization` EKF 적용을 시도하고 STM32·센서 처리 경험을 공유했습니다. 최종 위치 추정 방식은 다른 팀원이 구현했습니다. |
| 제22회 임베디드 소프트웨어 경진대회 (2024) | AWS DeepRacer 패키지와 ECU 간 소켓 연동을 시도했으나 완성하지 못했습니다. 대회에는 기존 DeepRacer 패키지를 사용했습니다. |

</details>

---

## 🏅 팀 수상

- **제22회 임베디드 소프트웨어 경진대회 최우수상** · 2024.11 · 팀 수상
- **한이음 ICT 멘토링 실외 배달로봇 v2 입선** · 2024.12 · 팀 수상

## 📫 Contact

- GitHub: [@Ugie01](https://github.com/Ugie01)
- 다른 실험·학습 코드는 [전체 저장소](https://github.com/Ugie01?tab=repositories)에서 확인할 수 있습니다.
