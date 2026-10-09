# 이명욱 로봇 SW 포트폴리오

정적 HTML, CSS, JavaScript로 만든 개인 포트폴리오입니다. 메인 페이지와 여섯 개 프로젝트 상세 페이지, 최신 웹 내용을 불러오는 PDF 출력 화면으로 구성됩니다.

## 웹에서 보기

**[포트폴리오 바로가기](https://ugie01.github.io/)**

브라우저에서 위 링크를 열면 됩니다. 메인 페이지에서 각 프로젝트의 **프로젝트 상세**를 누르거나 아래 링크로 바로 이동할 수 있습니다.

| 페이지 | 접속 링크 |
| --- | --- |
| AX Multi-Robot Logistics | [프로젝트 보기](https://ugie01.github.io/projects/fms.html) |
| GoSung | [프로젝트 보기](https://ugie01.github.io/projects/gosung.html) |
| AIMing Project | [프로젝트 보기](https://ugie01.github.io/projects/aiming.html) |
| Tracking Patrol Robot | [프로젝트 보기](https://ugie01.github.io/projects/tracking.html) |
| VIP Wearable | [프로젝트 보기](https://ugie01.github.io/projects/vip.html) |
| MPS 창고 적재 제어 | [프로젝트 보기](https://ugie01.github.io/projects/plc.html) |

전체 포트폴리오 PDF는 페이지 상단의 **PDF로 저장** 버튼 또는 [PDF 출력 화면](https://ugie01.github.io/print.html)에서 만들 수 있습니다.

웹에는 GitHub Pages에 배포된 버전이 표시됩니다. 로컬에서 수정한 내용은 저장소에 반영하고 배포가 완료된 뒤 웹에 적용됩니다.

## PDF로 저장하기

1. 웹페이지 상단의 **PDF로 저장**을 누릅니다.
2. 새 탭에서 전체 포트폴리오가 준비되면 **PDF로 저장** 버튼을 누릅니다.
3. 브라우저 인쇄 창에서 대상을 **PDF로 저장**, 용지를 **A4**, 방향을 **가로**, 배율을 **100%**로 선택합니다. 브라우저의 **머리글과 바닥글**은 해제합니다.
4. 미리보기를 확인하고 저장합니다.

출력 화면은 열 때마다 `index.html`과 메인에 연결된 프로젝트 상세 HTML을 읽습니다. 웹페이지의 본문, 역할, 기술, 이미지, 설명을 수정하면 다음 PDF 출력에도 반영됩니다. PDF 내용을 따로 편집하거나 Python으로 다시 생성할 필요가 없습니다. 이미 열어 둔 출력 화면에는 새로고침 후 변경 내용이 반영됩니다.

출력은 가로 A4로 구성합니다. 첫 장은 큰 프로필 사진과 소개, 기술을 담고, 각 프로젝트는 대표 이미지, 역할, 핵심 구현 항목, 구조와 결과를 한 페이지에 정리합니다. 현재는 소개 1장과 프로젝트 6장으로 총 7페이지입니다. 구현 항목은 웹의 앞쪽 4개를 사용하며, 분량이 많으면 마지막 항목부터 줄여 한 페이지를 유지합니다. 문장 중간을 자르거나 새로운 사실을 덧붙이지 않습니다. 웹에 배포된 최신 내용을 출력하려면 웹 주소에서 접속해 주세요.

## 파일 구성

| 경로 | 용도 |
| --- | --- |
| `index.html` | 메인 페이지 |
| `projects/*.html` | 프로젝트 상세 페이지 |
| `style.css`, `script.js` | 공통 스타일과 메뉴 동작 |
| `assets/portfolio-images/` | 웹페이지에 표시되는 프로젝트 이미지 |
| `print.html`, `print.js` | 최신 웹페이지를 모아 PDF 출력 화면 구성 |
| `print.css` | 가로 A4 배치, 이미지 프레임과 인쇄 서식 |
| `content/projects.json` | 프로젝트 설명을 정리한 데이터 파일 |

이미지를 교체할 때는 [`assets/portfolio-images/README.md`](assets/portfolio-images/README.md)의 파일명과 형식에 맞춰 덮어쓰면 됩니다.

웹페이지는 정적 파일입니다. `content/projects.json`만 바꿔도 페이지가 자동으로 바뀌지는 않으므로, 게시할 문구는 해당 HTML에도 반영해야 합니다. PDF는 실제 HTML에서 내용을 읽으므로 웹페이지를 수정하면 함께 반영됩니다.
