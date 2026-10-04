# 이명욱 로봇 SW 포트폴리오

정적 HTML, CSS, JavaScript로 만든 개인 포트폴리오입니다. 메인 페이지와 여섯 개 프로젝트 상세 페이지, 내려받기용 PDF로 구성됩니다.

## 파일 구성

| 경로 | 용도 |
| --- | --- |
| `index.html` | 메인 페이지 |
| `projects/*.html` | 프로젝트 상세 페이지 |
| `style.css`, `script.js` | 공통 스타일과 메뉴 동작 |
| `assets/portfolio-images/` | 웹페이지에 표시되는 프로젝트 이미지 |
| `assets/Lee_Myungwook_Robot_SW_Portfolio.pdf` | 상단 **PDF로 저장** 버튼의 파일 |
| `content/projects.json` | 프로젝트 설명을 정리한 데이터 파일 |

이미지를 교체할 때는 [`assets/portfolio-images/README.md`](assets/portfolio-images/README.md)의 파일명과 형식에 맞춰 덮어쓰면 됩니다.

웹페이지는 정적 파일입니다. `content/projects.json`만 바꿔도 페이지가 자동으로 바뀌지는 않으므로, 게시할 문구는 해당 HTML에도 반영해야 합니다. PDF도 미리 생성된 파일이어서 웹페이지나 이미지를 수정한 뒤에는 다시 생성해야 합니다.

## 로컬 확인

저장소 루트에서 다음 명령을 실행한 뒤 `http://127.0.0.1:4173`을 엽니다.

```sh
python -m http.server 4173 --bind 127.0.0.1
```

GitHub Pages용 사용자 사이트 저장소이며, 배포는 별도 작업입니다.
