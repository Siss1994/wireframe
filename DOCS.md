# Diagram Editor 문서

텍스트 기반 다이어그램 생성 도구입니다. Mermaid.js와 유사한 문법으로 9가지 다이어그램을 지원합니다.

## 목차

- [시작하기](#시작하기)
- [지원 다이어그램](#지원-다이어그램)
  - [Flowchart (플로우차트)](#flowchart-플로우차트)
  - [Sequence Diagram (시퀀스 다이어그램)](#sequence-diagram-시퀀스-다이어그램)
  - [State Diagram (상태 다이어그램)](#state-diagram-상태-다이어그램)
  - [Mindmap (마인드맵)](#mindmap-마인드맵)
  - [Pie Chart (파이 차트)](#pie-chart-파이-차트)
  - [Class Diagram (클래스 다이어그램)](#class-diagram-클래스-다이어그램)
  - [ER Diagram (ER 다이어그램)](#er-diagram-er-다이어그램)
  - [Gantt Chart (간트 차트)](#gantt-chart-간트-차트)
  - [User Journey (사용자 여정)](#user-journey-사용자-여정)
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

---

### Pie Chart (파이 차트)

비율이나 분포를 원형 차트로 표현합니다.

#### 기본 문법

```
pie showData title 차트 제목
    "항목1" : 40
    "항목2" : 30
    "항목3" : 20
    "항목4" : 10
```

#### 옵션

| 옵션 | 설명 |
|------|------|
| `showData` | 각 조각에 퍼센트 표시 |
| `title 제목` | 차트 제목 설정 |

#### 예제: 시장 점유율

```
pie showData title 브라우저 시장 점유율
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 8
    "Edge" : 5
    "기타" : 3
```

---

### Class Diagram (클래스 다이어그램)

객체지향 설계의 클래스 구조와 관계를 표현합니다.

#### 기본 문법

```
classDiagram
    class ClassName
    ClassName : +attribute
    ClassName : +method()
```

#### 클래스 멤버

```
ClassName : +publicAttr
ClassName : -privateAttr
ClassName : #protectedAttr
ClassName : ~packageAttr
ClassName : +publicMethod()
```

#### 접근 제어자

| 기호 | 접근 수준 |
|------|----------|
| `+` | public |
| `-` | private |
| `#` | protected |
| `~` | package |

#### 관계 유형

| 문법 | 관계 | 설명 |
|------|------|------|
| `A <\|-- B` | 상속 | B가 A를 상속 |
| `A *-- B` | 컴포지션 | A가 B를 포함 (강한 결합) |
| `A o-- B` | 집합 | A가 B를 포함 (약한 결합) |
| `A --> B` | 연관 | A가 B를 참조 |
| `A <.. B` | 의존 | B가 A에 의존 |

#### 예제: 동물 클래스

```
classDiagram
    Animal <|-- Dog
    Animal <|-- Cat
    Animal : +String name
    Animal : +int age
    Animal : +makeSound()
    Dog : +String breed
    Dog : +bark()
    Cat : +meow()
```

---

### ER Diagram (ER 다이어그램)

데이터베이스의 엔티티와 관계를 표현합니다.

#### 기본 문법

```
erDiagram
    ENTITY1 ||--o{ ENTITY2 : relationship
```

#### 카디널리티

| 기호 | 의미 |
|------|------|
| `\|\|` | 정확히 1 |
| `o\|` | 0 또는 1 |
| `\|{` | 1 이상 |
| `o{` | 0 이상 |

#### 엔티티 속성

```
ENTITY {
    type attributeName PK
    type attributeName FK
    type attributeName UK
}
```

| 키 | 설명 |
|-----|------|
| `PK` | Primary Key |
| `FK` | Foreign Key |
| `UK` | Unique Key |

#### 예제: 사용자-주문

```
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes

    USER {
        int id PK
        string name
        string email UK
    }
    ORDER {
        int id PK
        int user_id FK
        date created_at
    }
```

---

### Gantt Chart (간트 차트)

프로젝트 일정과 진행 상황을 표현합니다.

#### 기본 문법

```
gantt
    title 프로젝트 제목
    dateFormat YYYY-MM-DD

    section 섹션명
    태스크명 : 시작일, 기간
```

#### 태스크 정의

```
태스크명 : 상태, 시작일, 기간
태스크명 : 2024-01-01, 5d
태스크명 : done, 2024-01-01, 3d
```

#### 태스크 상태

| 상태 | 색상 | 설명 |
|------|------|------|
| (기본) | 파랑 | 예정된 태스크 |
| `done` | 초록 | 완료된 태스크 |
| `active` | 노랑 | 진행 중 태스크 |
| `crit` | 빨강 | 중요 태스크 |

#### 예제: 프로젝트 일정

```
gantt
    title 프로젝트 개발 일정
    dateFormat YYYY-MM-DD

    section 기획
    요구사항 분석 : done, 2024-01-01, 7d
    기획서 작성 : done, 2024-01-08, 5d

    section 개발
    백엔드 개발 : active, 2024-01-13, 14d
    프론트엔드 개발 : 2024-01-15, 14d

    section 테스트
    통합 테스트 : crit, 2024-01-27, 7d
```

---

### User Journey (사용자 여정)

사용자 경험의 각 단계를 감정 점수와 함께 표현합니다.

#### 기본 문법

```
journey
    title 여정 제목

    section 단계명
    태스크: 점수: 액터1, 액터2
```

#### 점수 체계

| 점수 | 감정 | 색상 |
|------|------|------|
| 1-2 | 부정적 | 빨강 |
| 3 | 보통 | 노랑 |
| 4-5 | 긍정적 | 초록 |

#### 예제: 쇼핑 경험

```
journey
    title 온라인 쇼핑 경험

    section 탐색
    홈페이지 방문: 5: 고객
    상품 검색: 4: 고객
    상품 상세 확인: 4: 고객

    section 구매
    장바구니 담기: 5: 고객
    결제 진행: 3: 고객
    결제 완료: 5: 고객

    section 배송
    배송 추적: 4: 고객
    상품 수령: 5: 고객
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
| Pie Chart | O | O |
| Class Diagram | O | O |
| ER Diagram | O | O |
| Gantt | O | O |
| User Journey | O | O |
| Git Graph | O | X |
| Timeline | O | X |
| Sankey | O | X |
| Quadrant | O | X |
| XY Chart | O | X |

---

## 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

---

## 라이선스

MIT License
