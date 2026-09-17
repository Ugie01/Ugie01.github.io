# 이미지·영상 및 외부 자산 출처

포트폴리오 이미지는 사용자가 제공한 프로젝트 폴더의 실제 사진·발표 자료·시연 영상에서 선별했다. 생성형 이미지, 외부 스톡 사진, 프로젝트와 무관한 제품 사진을 실물 결과로 사용하지 않았다. 원본은 수정하지 않았다. 표시용 사본만 WebP로 변환·축소했고 종횡비를 유지한다.

| 사이트 파일 (`assets/projects/`) | 원본 | 표시 의미 |
|---|---|---|
| `fms-route.svg` | [Logistics_FMS routes/test.geojson, ugie-fms](https://github.com/E1I6-Logistics/Logistics_FMS/blob/ugie-fms/routes/test.geojson) | 실제 노드 좌표·엣지를 SVG로 재구성. 관제 화면 캡처나 실시간 로봇 위치 아님 |
| `fms-system.svg` | 동일 저장소의 Zenoh 서비스·ROS Gateway·Bridge 설정·디버깅 문서 | 통신 구조를 설명하기 위해 작성한 구성도 |
| `gosung-robot.webp` | `GoSung_v2 - 6명/실외 배달로봇/실외 사진/KakaoTalk_20250407_092046336_13.jpg` | 실제 로봇·배선 사진 |
| `gosung-fusion.webp` | 같은 폴더의 `화면 캡처 2025-04-07 105503.png` | Camera/LiDAR 실험 화면. 후속 보관 시점의 파일이므로 촬영일을 개발 기간으로 사용하지 않음 |
| `aiming-board.webp` | `AIMing_Project - 4명/AI대공추적터렛_이명욱.pptx`, `ppt/media/image25.png`에 해당하는 image25 자산 | 실물 보드·디스플레이 |
| `aiming-demo.webp` | `AIMing_Project - 4명/AI_part/데모영상 GOOD.mp4`, 전체 길이의 약 40% 지점 | 약 5.9초 시연 프레임 |
| `tracking-robot.webp` | `Tracking_Patrol_Robot - 4명/AI융합로봇_3기_결과보고서(2조).pptx`, image89 자산 | 실제 로봇 사진 |
| `tracking-demo.webp` | 같은 발표 파일, image77 자산 | 실제 인물 추적 화면. AI 모델은 팀원 담당 |
| `vip-demo.webp` | `VIP_wearable - 2명/이명욱/VIP_Wearable 동작 영상.mp4`, 전체 길이의 약 40% 지점 | 약 43.6초 프레임. 팀 AI 출력과 본인 앱 통합 시연 |
| `vip-app.webp` | `VIP_wearable - 2명/이정훈/2026ESWContest_자유공모_VIPWEARABLE_개발완료보고서.pptx`, image18 자산 | TMAP 앱 화면 |
| `plc-demo.webp` | `PLC_미니프로젝트_이명욱, 정승호/전체동작/전체동작.mp4`, 전체 길이의 약 40% 지점 | 약 79초 동작 프레임 |
| `plc-hmi.webp` | `PLC_미니프로젝트_이명욱, 정승호/PLC 발표_이명욱.pptx`, image15 자산 | 수동 제어 HMI 화면 |

총 12개 프로젝트 자산. FMS를 제외한 사진·프레임은 원본 비율로 표시하며 빈 영역은 배경으로 유지한다. 기술 시연을 잘라내거나 합성하지 않는다. PPTX 내 이미지 확장자는 원본 아카이브에 따라 다를 수 있어 image 번호로 식별한다.

## 영상 링크

GitHub README에서 확인한 YouTube URL을 사용한다. 외부 썸네일·자동 재생·추적용 iframe은 로드하지 않는다. YouTube 링크의 등록 사실은 확인했지만 로그인/지역/게시 상태에 따른 재생 가능성은 보장하지 않는다.

- GoSung: `ovQ-Pq1NfFU`
- AIMing: `Eg0nYeOGCXA`
- Tracking: `0Xhue5Aivyg`
- VIP Wearable: `4h71w1IgXRw`
- FMS는 공개 시연 영상 준비 중. PLC 원본 영상은 약 236MB로 정적 저장소에 복제하지 않았으며 공개 URL 미등록을 표시한다.

## 폰트·라이브러리

- 사이트 런타임: HTML, CSS, Vanilla JavaScript만 사용. 외부 CDN·분석 도구·백엔드 없음.
- 폰트: 기기에 설치된 Pretendard → Noto Sans KR → 맑은 고딕 → 시스템 글꼴 순으로 사용. 폰트 파일을 배포하거나 외부 요청하지 않음.
- 코드 표기: Consolas / SFMono-Regular / 시스템 monospace.
- 파비콘과 설명용 도식: 이 포트폴리오용 SVG/CSS. 외부 아이콘 라이브러리 없음.
- 미디어 전처리: 로컬 OpenCV·Pillow 사용. 실행 시 사이트에 필요하지 않음.
- 브라우저 검증: Playwright와 Microsoft Edge. 검증 도구이며 사이트 의존성이 아님.
- 프로젝트별 오픈소스·패키지는 각 상세 페이지의 TEAM / EXTERNAL 및 원본 GitHub에서 구분한다. 프로젝트 원본 라이브러리를 이 사이트 저장소로 복제하지 않았다.
