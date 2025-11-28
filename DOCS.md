# Diagram Editor 문서

텍스트 기반 다이어그램 생성 도구입니다. Mermaid.js와 유사한 문법으로 4가지 다이어그램을 지원합니다.

## 목차

- [시작하기](#시작하기)
- [지원 다이어그램](#지원-다이어그램)
  - [Flowchart (플로우차트)](#flowchart-플로우차트)
  - [Sequence Diagram (시퀀스 다이어그램)](#sequence-diagram-시퀀스-다이어그램)
  - [State Diagram (상태 다이어그램)](#state-diagram-상태-다이어그램)
  - [Mindmap (마인드맵)](#mindmap-마인드맵)
- [단축키](#단축키)
- [내보내기](#내보내기)

---

## 시작하기

1. `diagram-editor.html` 파일을 브라우저에서 엽니다
2. 상단 탭에서 다이어그램 타입을 선택합니다
3. 왼쪽 에디터에 코드를 입력합니다
4. `Ctrl+Enter` 또는 렌더링 버튼을 클릭하여 결과를 확인합니다

---

## 지원 다이어그램

### Flowchart (플로우차트)

프로세스 흐름, 의사결정 트리 등을 표현합니다.

#### 기본 문법

```
flowchart TD
    A[시작] --> B{조건}
    B -->|Yes| C[처리]
    B -->|No| D[종료]
```

#### 방향 설정

| 코드 | 방향 |
|------|------|
| `TD` | 위에서 아래로 (Top Down) |
| `TB` | 위에서 아래로 (Top Bottom) |
| `BT` | 아래에서 위로 (Bottom Top) |
| `LR` | 왼쪽에서 오른쪽으로 (Left Right) |
| `RL` | 오른쪽에서 왼쪽으로 (Right Left) |

#### 노드 형태

| 문법 | 형태 | 용도 |
|------|------|------|
| `A[텍스트]` | 사각형 | 일반 프로세스 |
| `A(텍스트)` | 둥근 사각형 | 시작/종료 |
| `A{텍스트}` | 다이아몬드 | 조건/판단 |
| `A((텍스트))` | 원형 | 연결점 |
| `A[[텍스트]]` | 서브루틴 | 하위 프로세스 |

#### 연결선 (엣지)

| 문법 | 설명 |
|------|------|
| `A --> B` | 화살표 연결 |
| `A --- B` | 직선 연결 |
| `A -.-> B` | 점선 화살표 |
| `A ==> B` | 굵은 화살표 |
| `A -->|라벨| B` | 라벨이 있는 연결 |

#### 예제: 로그인 플로우

```
flowchart TD
    Start[사용자 접속] --> Login[로그인 페이지]
    Login --> Input[아이디/비밀번호 입력]
    Input --> Validate{유효성 검사}
    Validate -->|성공| Dashboard[대시보드]
    Validate -->|실패| Error[에러 메시지]
    Error --> Input
    Dashboard --> Logout[로그아웃]
    Logout --> Start
```

---

### Sequence Diagram (시퀀스 다이어그램)

시스템 간의 상호작용을 시간 순서대로 표현합니다.

#### 기본 문법

```
sequenceDiagram
    participant A as 클라이언트
    participant B as 서버

    A ->> B: 요청
    B -->> A: 응답
```

#### 참여자 정의

```
participant ID as 표시이름
actor ID as 표시이름     %% 사람 아이콘으로 표시
```

#### 메시지 유형

| 문법 | 설명 |
|------|------|
| `A ->> B: msg` | 동기 메시지 (실선 + 화살표) |
| `A -->> B: msg` | 응답 메시지 (점선 + 화살표) |
| `A -> B: msg` | 단순 메시지 |
| `A --> B: msg` | 점선 메시지 |

#### 노트

```
Note left of A: 왼쪽 노트
Note right of A: 오른쪽 노트
Note over A,B: A와 B 사이 노트
```

#### 활성화

```
activate A
deactivate A
```

#### 예제: API 통신

```
sequenceDiagram
    participant Client as 클라이언트
    participant API as API 서버
    participant DB as 데이터베이스
    participant Cache as 캐시

    Client ->> API: GET /users/123
    API ->> Cache: 캐시 확인
    Cache -->> API: 캐시 미스
    API ->> DB: SELECT * FROM users
    DB -->> API: 사용자 데이터
    API ->> Cache: 캐시 저장
    API -->> Client: 200 OK + JSON
```

---

### State Diagram (상태 다이어그램)

객체의 상태 변화를 표현합니다.

#### 기본 문법

```
stateDiagram
    [*] --> 대기
    대기 --> 실행: 시작
    실행 --> 완료: 종료
    완료 --> [*]
```

#### 특수 상태

| 문법 | 설명 |
|------|------|
| `[*]` | 시작/종료 상태 |

#### 상태 전환

```
상태A --> 상태B           %% 단순 전환
상태A --> 상태B: 이벤트   %% 이벤트 레이블 포함
```

#### 상태 정의

```
state "설명 텍스트" as s1
```

#### 예제: 주문 상태

```
stateDiagram
    [*] --> 주문대기

    주문대기 --> 결제대기: 주문접수
    결제대기 --> 결제완료: 결제성공
    결제대기 --> 주문취소: 결제실패

    결제완료 --> 배송준비: 재고확인
    배송준비 --> 배송중: 발송
    배송중 --> 배송완료: 수령확인

    배송완료 --> [*]
    주문취소 --> [*]
```

---

### Mindmap (마인드맵)

아이디어나 개념의 계층적 구조를 표현합니다.

#### 기본 문법

```
mindmap
    root((중심 주제))
        주제1
            세부항목1
            세부항목2
        주제2
            세부항목3
```

#### 노드 형태

| 문법 | 형태 | 색상 |
|------|------|------|
| `root((텍스트))` | 타원 (루트) | 빨강 |
| `((텍스트))` | 원형 | 파랑 |
| `[텍스트]` | 사각형 | 초록 |
| `(텍스트)` | 둥근 사각형 | 보라 |
| `텍스트` | 기본 | 주황 |
| `)텍스트(` | 클라우드 | 청록 |

#### 계층 구조

들여쓰기(공백 또는 탭)로 계층을 구분합니다.

```
mindmap
    root((루트))
        레벨1-A
            레벨2-A
            레벨2-B
        레벨1-B
            레벨2-C
                레벨3-A
```

#### 예제: 프로젝트 구조

```
mindmap
    root((프로젝트 계획))
        [1단계: 분석]
            요구사항 수집
            현황 분석
            문제점 도출
        [2단계: 설계]
            시스템 설계
            DB 설계
            UI/UX 설계
        [3단계: 개발]
            (프론트엔드)
                React
                TypeScript
            (백엔드)
                Node.js
                PostgreSQL
        [4단계: 테스트]
            단위 테스트
            통합 테스트
            사용자 테스트
        [5단계: 배포]
            스테이징
            프로덕션
```

---

## 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl + Enter` | 렌더링 |
| `Tab` | 들여쓰기 |
| `Esc` | 사이드바/도움말 닫기 |

---

## 내보내기

### SVG 저장
- 벡터 형식으로 확대해도 깨지지 않음
- 웹페이지에 삽입하기 좋음
- Adobe Illustrator 등에서 편집 가능

### PNG 저장
- 래스터 이미지 형식
- 2배 해상도로 저장
- 문서나 프레젠테이션에 적합

---

## 파일 구조

```
wireframe/
├── diagram-editor.html  # 메인 HTML 페이지
├── diagram-style.css    # 스타일시트
├── diagram-parser.js    # 다이어그램 파서
├── diagram-renderer.js  # SVG 렌더러
├── diagram-app.js       # 앱 로직
└── DOCS.md             # 이 문서
```

---

## 주석

모든 다이어그램 타입에서 `%%`로 시작하는 줄은 주석으로 처리됩니다.

```
flowchart TD
    %% 이것은 주석입니다
    A --> B
```

---

## 문법 비교 (Mermaid.js vs 이 도구)

| 기능 | Mermaid.js | 이 도구 |
|------|------------|---------|
| Flowchart | O | O |
| Sequence | O | O |
| State | O | O |
| Mindmap | O | O |
| Class Diagram | O | X |
| ER Diagram | O | X |
| Gantt | O | X |
| Pie Chart | O | X |

이 도구는 가장 많이 사용되는 4가지 다이어그램 타입에 집중하여 구현되었습니다.

---

## 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

---

## 라이선스

MIT License
