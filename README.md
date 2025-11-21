# Wireframe Code Builder

코드로 와이어프레임을 작성하고 렌더링할 수 있는 웹 애플리케이션입니다.

## 특징

- 📝 **코드 기반**: Mermaid처럼 텍스트 코드로 와이어프레임 작성
- 🎨 **시각적 렌더링**: Balsamiq처럼 실시간으로 와이어프레임 미리보기
- 🤖 **AI 친화적**: 간단한 DSL로 AI가 쉽게 생성 가능
- ⚡ **실시간 피드백**: 코드 변경 시 즉시 렌더링
- 📱 **반응형**: 다양한 화면 크기 지원
- 🎯 **35+ 컴포넌트**: 폼, 레이아웃, 네비게이션, 데이터, 차트 등 다양한 UI 요소

## 사용 방법

1. 브라우저에서 `index.html` 파일을 엽니다
2. 왼쪽 에디터에 와이어프레임 코드를 입력합니다
3. "렌더링" 버튼을 클릭하거나 `Ctrl+Enter`를 누릅니다
4. 오른쪽 미리보기 영역에서 결과를 확인합니다

## 지원하는 컴포넌트 (35개)

### 기본 컴포넌트 (7개)
- `page` - 페이지 설정
- `container` - 컨테이너/섹션
- `button` - 버튼
- `text` - 텍스트
- `input` - 입력 필드
- `image` - 이미지 플레이스홀더
- `grid` - 그리드 레이아웃

### 폼 요소 (6개)
- `checkbox` - 체크박스
- `radio` - 라디오 버튼
- `dropdown` - 드롭다운 선택
- `textarea` - 텍스트 영역
- `toggle` - 토글 스위치
- `slider` - 슬라이더

### 레이아웃 (5개)
- `card` - 카드
- `sidebar` - 사이드바
- `header` - 헤더
- `footer` - 푸터
- `modal` - 모달

### 네비게이션 (5개)
- `navbar` - 네비게이션 바
- `tabs` - 탭
- `breadcrumb` - 브레드크럼
- `pagination` - 페이지네이션
- `menu` - 메뉴

### 데이터 표시 (2개)
- `table` - 테이블
- `list` - 리스트

### 피드백 (3개)
- `alert` - 알림 (info, success, warning, error)
- `badge` - 배지
- `progress` - 프로그레스 바

### 미디어 (2개)
- `video` - 비디오 플레이스홀더
- `icon` - 아이콘

### 차트/맵 (2개)
- `chart` - 차트 (bar, line, pie)
- `map` - 지도

### 기타 (3개)
- `divider` - 구분선
- `avatar` - 아바타
- `tooltip` - 툴팁

## 간단한 예제

```wireframe
page "마이페이지" {
  width: 1200
  height: 800
}

header "My Dashboard" {
  x: 0
  y: 0
  width: 1200
  height: 70
}

sidebar "메뉴" {
  x: 0
  y: 70
  width: 250
  height: 730
}

card "통계" {
  x: 270
  y: 90
  width: 300
  height: 200
}

chart "월별 데이터" {
  x: 600
  y: 90
  width: 570
  height: 300
  type: bar
}

table {
  x: 270
  y: 410
  width: 900
  height: 350
  rows: 6
  columns: 4
}
```

## 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# 또는 Node.js
npx http-server
```

그리고 브라우저에서 `http://localhost:8000`을 엽니다.

## 단축키

- `Ctrl+Enter` (또는 `Cmd+Enter`): 렌더링

## 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript (프레임워크 없음)

## 향후 개선 사항

- [ ] html2canvas를 이용한 이미지 내보내기
- [ ] 드래그 앤 드롭으로 요소 이동
- [ ] 더 많은 UI 컴포넌트 추가
- [ ] 코드 자동 완성
- [ ] 다크 모드
- [ ] 템플릿 저장/불러오기

## 라이센스

MIT
