# 포트폴리오 사실 확인표

검토일: 2026-09-17. 로컬 코드, 발표 자료, 사용자 회고와 GitHub를 교차 확인했다. 코드 존재는 동작 검증이나 단독 저작의 증명이 아니므로 구분한다. 원본 회고의 사적인 표현과 내부 IP는 공개하지 않는다.

## 출처와 확인 범위

| 프로젝트 | 기간 / 인원 | 목적 · 전체 시스템 | 본인 기여로 채택 | 외부 / 팀 구현 | 결과와 한계 |
|---|---|---|---|---|---|
| AX Logistics MultiBot | 2026 진행 중 / 7명(폴더·역할 설명) | 물류 로봇 관제, Web–FMS–Zenoh–ROS 2 | 통신, 상태 연동, Mock Fleet, 환경 구성, 연결 관리, 통합·디버깅 | Nav2, TurtleBot3, Zenoh Bridge 및 팀의 맵·시나리오 | 소스와 디버깅 기록 확인. 종합 물류 운영 완료로 표현하지 않음 |
| GoSung | 2024.04.01–12.12 / 6명(회고) | 센서/구동 MCU와 ROS 2 기반 실외 배달 로봇 | STM32 펌웨어, Serial Node, Hall 기반 보정, 초음파 정지, Camera/LiDAR 연결 | Nav2, yolov5-ros2, Lakibeam driver, 기존 로봇 패키지 | 경사로 정차 동작 회고. 급가속·외력 오인식 미해결, 정량 속도 검증 없음 |
| AIMing | 2026.07.23–08.04 / 4명(회고·자료) | MCU의 영상 입력·기존 모델 추론·Pan/Tilt PoC | FreeRTOS 구조, 추론 파이프라인과 하드웨어 연결 | 모델 학습, 기존 OV2640/서보 코드, Edge Impulse/TFLite | 실물 시연. 모션 블러·재촬영 한계. FPS 향상·명중률 수치 채택 안 함 |
| Tracking | 2026.05.11–05.21 / 4명(사용자 확인) | 비전 인식–RPi 추적–STM32 제어–Flutter 앱 | 트래킹·상황 판단·목표 명령 연동 주담당, STM32/PID 일부 지원 | AI 모델 팀 작업. STM32/PID 주 구현은 팀원, 본인 기여는 일부 지원 | 시연 자료 존재. 화재 기능 검증 없음, 재식별 조건 한계 |
| VIP Wearable | 2026.07.01–08.12 / 2명(회고·보고서) | Android 길안내와 RPi 센서·비전·햅틱 | RFCOMM, IMU 파싱, 낙상 FSM, PWM, 앱 | 이정훈: 모델·양자화·AI 파이프라인. TMAP/Android SDK/lgpio | 시연 존재. 낙상 정확도·위치 추정·재연결 검증 부족 |
| PLC | 정확한 기간 확인 필요 / 2명(발표 표지) | MPS 창고 적재·배출·수동 제어 실습 | 시퀀스와 HMI 공동 구현 범위 | Mitsubishi PLC, GX Works2, GT Designer3, MPS 교육 장비 | 전체 동작 영상. 현장 자동화 실적으로 표현하지 않음 |

## 코드 근거

- FMS: `ugie-fms` 트리 조회 시 commit `d6a6e4803a5aab6c142bf19d308fe7c0a6fecf4c`. `backend/app/services/zenoh_service.py` 상태 구독, `ros_gateway.py` NavigateToPose Action, `routers/connections.py` allow/block, `simulation/mock_fleet.py` 텔레메트리와 goal 중계, `robots_ws/src/zenoh_pkg/config/bridge.json5` deny 필터, `debug/zenog_debug 과정.md` 위치 튐 원인 조사. README의 `robots/` 구조는 현재 트리의 `robots_ws/`와 다르므로 README만으로 판단하지 않았다.
- GoSung: `stm32/code/구동부/Src/MOTOR.c`, `freertos.c`, `SRF08.c`; `ros2/gps_imu/gps_imu/gps_imu_publisher.py`. 구동/초음파 태스크는 모두 `osPriorityNormal`이다. 따라서 '최우선순위 RTOS 태스크'를 주장하지 않는다. PWM 증감은 PID가 아니다.
- AIMing: `aiming_project/Core/Src/freertos.c`, `Tasks/task_vision.cpp`, `Tasks/task_motor.c`, `Modules/camera.c`. Vision/Motor 태스크, Queue, Semaphore와 `run_classifier` 호출을 확인했다. 카메라·AI·제어의 3개 독립 태스크라고 쓰지 않는다.
- Tracking: `firmware/Core/Src/motor.c`, `main.c`, `imu.c`, `app/lib/main.dart`, `ai_vision/tracking_robot_custom.py`. Yaw PID 코드와 튜닝 UI는 존재하지만 저작 범위는 자료 간 불일치. PID 함수의 dt와 주석의 주기에도 차이가 있어 제어 주파수·정확도 수치 제외.
- VIP: `vip_wearable_rasi/basic/hardware_controller.py`, `bt_core.py`, `main.py`, Java 앱. FSM 및 우선순위 분기 존재. 낙상 FSM은 정지 조건을 일정 시간 후 확인하므로 '1초 내내 정지 확인'으로 과장하지 않는다. IMU 패킷의 체크섬 구간과 가속도 파싱 구간이 겹쳐 보이는 부분은 추가 확인 사항이다. 구현 존재를 감지 정확도 증명으로 취급하지 않는다.
- PLC: `PLC 발표_이명욱.pptx` 3–5, 15, 17번 슬라이드. Q03UDVCPU, Q61P, QX40/QY10, QD77MS2, GX Works2, GT Designer3 확인. `.gxw`, `.pcw`, `.gt32` 원본 존재는 확인했지만 해당 IDE로 실행하지 않았다.

## FMS 구현 상태

| 범위 | 포트폴리오 표현 |
|---|---|
| 상태 구독·명령 연동·연결 차단·Mock Fleet·Bridge 설정 | 코드 확인 / 실제 전체 시스템 재실행은 하지 않음 |
| TurtleBot 환경·통신 통합 | 코드·설정·사용자 기록 기반, 진행 중 |
| 주문 자동 배차·Edge/Node 점유·교통관리·Deadlock·작업 스케줄링 | 완료 근거 미확인, 향후 구현·검증 범위 |
| OMX·VLM 비교 | 사용자 회고상 향후 계획 |

## 자료 불일치와 확인할 사항

1. Tracking: 자료 간 인원 충돌은 사용자 답변으로 해소. 최종 4명.
2. Tracking: 결과보고서는 이명욱=트래킹, 김지우=센서/모터/PID. GitHub는 이명욱=펌웨어/통신/Flutter, 안재권=Bluetooth/PID, 김지우=전처리. 첨부 프롬프트는 이명욱에게 Yaw PID를 포함. 사용자 확인: 본인은 트래킹 주담당이며 STM32와 PID도 일부 도왔음. 펌웨어·PID는 기여가 크지 않은 지원 역할로 반영.
3. FMS 시작일, PLC 기간, 공개 이메일 미확인. 임의로 채우지 않음.
4. PLC 모듈별 개인 분담 미확정. 2인 공동 구현으로 표시.
5. BLE 변경 이유는 회고에 있고 현재 RFCOMM 코드는 확인됨. 안정성 '완전 해결'이나 개선률을 주장하지 않음.
6. 기존 초안의 학점·수상 수치는 추가 증빙 없이 확장하지 않음. 교육은 현재 수강 중, 종료 예정일과 구분.

## 과장 위험 표현 → 채택한 문구

| 피할 표현 | 채택 |
|---|---|
| 자율주행/SLAM/경로계획 알고리즘 개발 | 기존 패키지 적용·설정·연동 |
| GoSung PID 속도 제어 | Hall Sensor 오차에 따른 PWM 증감 보정 |
| AI 모델 개발 / 전체 시스템 단독 개발 | 기존 모델 추론 결과와 하드웨어 제어 연동 |
| 성능 2배 향상 / 실시간성 보장 | 코드와 시연에서 확인한 동작 범위 |
| 완성된 FMS 자동 배차·교착 해결 | 진행 중, 완료 근거 없는 기능은 계획으로 분리 |
| 산업용 생산설비 개발 | 교육용 MPS 트레이너 공동 실습 |

## 페이지 구성과 시각 방향

정적 HTML/CSS/JavaScript. 메인은 Hero → Featured FMS → 나머지 프로젝트 → About → Skills → Contact. FMS만 화면 전체를 크게 사용하지 않고 다른 카드들과 비슷한 정보 밀도 유지. 각 프로젝트의 별도 상세 페이지에는 개요, 본인 역할, 구현, 팀/외부, 시스템 구성도, 문제→판단→결과→한계, 코드와 영상 링크를 둔다. 화이트/네이비/블루, 최대 1200px, 모바일 1열. 미확인 연락처·가짜 성과·가짜 데모 없음.

## 저장소 / 공개 영상

- [FMS ugie-fms](https://github.com/E1I6-Logistics/Logistics_FMS/tree/ugie-fms): 공개 데모 미확인.
- [GoSung](https://github.com/Ugie01/GoSung) · [시연](https://www.youtube.com/watch?v=ovQ-Pq1NfFU)
- [AIMing](https://github.com/Ugie01/AIMing_Project) · [시연](https://www.youtube.com/watch?v=Eg0nYeOGCXA)
- [Tracking](https://github.com/Ugie01/Tracking_Patrol_Robot) · [시연](https://www.youtube.com/watch?v=0Xhue5Aivyg)
- [VIP Wearable](https://github.com/Ugie01/2026ESWContest_free_VIPWEARABLE) · [시연](https://www.youtube.com/watch?v=4h71w1IgXRw)
- PLC: 로컬 발표 자료와 동작 영상만 확인. 가짜 GitHub/Demo 버튼을 만들지 않음.
