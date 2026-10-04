# 포트폴리오 이미지 교체

이 폴더의 파일을 **같은 이름과 실제 이미지 형식**으로 덮어쓰면 웹페이지에 반영됩니다. 확장자만 바꾸지 말고 PNG, JPG, WebP, SVG 중 파일명에 맞는 형식으로 저장해 주세요. 이미지 전체가 보이도록 원본 비율을 유지해 표시합니다. 가로와 세로가 더 큰 원본이 선명하게 보입니다.

| 프로젝트 | 대표 이미지 | 상세 이미지 1 | 상세 이미지 2 |
| --- | --- | --- | --- |
| AX Logistics Multi Robot | `fms-cover.png` 관제 웹페이지 | `fms-map-robot.png` 실제 맵과 로봇 주행 | `fms-system.svg` 전체 관제, 로봇, 로봇팔 구조 |
| GoSung | `gosung-cover.jpg` 완성된 로봇 | `gosung-sensor-fusion.webp` 센서 융합 | `gosung-ramp-stop.jpg` 경사로 정지 시험 |
| AIMing Project | `aiming-cover.webp` 시연 영상 프레임 | `aiming-blue-noise.webp` 청색 노이즈 | `aiming-lock-on.jpg` Lock-On |
| Tracking Patrol Robot | `tracking-cover.webp` 시연 화면 | `tracking-normal.webp`, `tracking-danger.png`, `tracking-fall.png` 정상, 위험, 낙상 3분할 | `tracking-distance.png` 거리 유지 |
| VIP Wearable | `vip-cover.jpg` 얼굴 모자이크 착용 사진 | `vip-route.webp` 앱 경로 생성 | `vip-obstacle-app.webp` 장애물 인식과 앱 화면 |
| MPS 창고 적재 제어 | `plc-demo.webp` | `plc-demo.webp` | `plc-hmi.webp` |

FMS 상세 이미지 1과 2는 아직 지정한 실제 주행 및 전체 구조 이미지가 아닙니다. 현재는 **모의 관제 화면과 경로 그래프를 임시로 넣고**, 웹페이지에도 교체 예정이라고 표시했습니다. 나중에 실제 이미지로 교체할 때 `fms-system.svg`는 SVG 형식으로 저장하거나, HTML과 `content/projects.json`의 경로를 새 확장자에 맞게 바꿔 주세요. 설명 문구도 실제 이미지에 맞춰 수정해 주세요.

Tracking 상세 이미지 1은 위의 세 파일에서 시연 영상 부분만 보이도록 웹페이지에서 잘라 배치합니다. 상세 이미지 2도 `tracking-distance.png` 한 장의 가로 자세와 세로 자세 부분을 각각 잘라 표시합니다. 원본 파일은 그대로이며, 다른 구도의 파일로 교체하면 `style.css`의 `tracking-media` 자르기 위치도 조정해야 합니다. VIP 착용 사진은 현재 얼굴이 모자이크된 원본을 사용합니다. 사진을 교체할 때도 얼굴을 가린 버전을 넣어 주세요.

`portrait.webp`는 홈 프로필 이미지입니다. 상단 **PDF로 저장** 버튼은 별도 PDF 파일을 다운로드하므로, 이미지를 바꾼 뒤 PDF에도 반영하려면 PDF를 다시 만들어야 합니다.
