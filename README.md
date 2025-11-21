# Wireframe Code Builder

코드로 와이어프레임을 작성하고 렌더링할 수 있는 웹 애플리케이션입니다.

## 특징

- 📝 **코드 기반**: Mermaid처럼 텍스트 코드로 와이어프레임 작성
- 🎨 **시각적 렌더링**: Balsamiq처럼 실시간으로 와이어프레임 미리보기
- 🤖 **AI 친화적**: 간단한 DSL로 AI가 쉽게 생성 가능
- ⚡ **실시간 피드백**: 코드 변경 시 즉시 렌더링
- 📱 **반응형**: 다양한 화면 크기 지원

## 사용 방법

1. 브라우저에서 `index.html` 파일을 엽니다
2. 왼쪽 에디터에 와이어프레임 코드를 입력합니다
3. "렌더링" 버튼을 클릭하거나 `Ctrl+Enter`를 누릅니다
4. 오른쪽 미리보기 영역에서 결과를 확인합니다

## 문법 가이드

### 페이지 설정

```
page "페이지 제목" {
  width: 1200
  height: 800
}
```

### 컨테이너

```
container "컨테이너명" {
  x: 0
  y: 0
  width: 1200
  height: 100
  background: #f0f0f0
}
```

### 버튼

```
button "버튼 텍스트" {
  x: 50
  y: 50
  width: 120
  height: 40
}
```

### 텍스트

```
text "텍스트 내용" {
  x: 50
  y: 100
  size: 16
  color: #333
}
```

### 입력 필드

```
input "placeholder 텍스트" {
  x: 50
  y: 150
  width: 200
  height: 40
}
```

### 이미지

```
image "이미지 설명" {
  x: 50
  y: 200
  width: 300
  height: 200
}
```

### 네비게이션 바

```
navbar {
  height: 60
  items: ["홈", "소개", "서비스", "연락처"]
}
```

### 그리드 레이아웃

```
grid {
  x: 50
  y: 300
  columns: 3
  gap: 20
  items: 6
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
