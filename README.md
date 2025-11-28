# Diagram Editor - AI를 위한 완벽 가이드

텍스트 기반 다이어그램 생성 도구입니다. Mermaid.js와 유사한 문법으로 **10가지** 다이어그램을 지원합니다.
이 문서는 AI가 다이어그램을 이해하고 생성할 수 있도록 작성되었습니다.

---

## 목차

1. [시작하기](#시작하기)
2. [다이어그램 타입 개요](#다이어그램-타입-개요)
3. [상세 문법 가이드](#상세-문법-가이드)
   - [Flowchart](#1-flowchart-플로우차트)
   - [Sequence Diagram](#2-sequence-diagram-시퀀스-다이어그램)
   - [State Diagram](#3-state-diagram-상태-다이어그램)
   - [Mindmap](#4-mindmap-마인드맵)
   - [Pie Chart](#5-pie-chart-파이-차트)
   - [Class Diagram](#6-class-diagram-클래스-다이어그램)
   - [ER Diagram](#7-er-diagram-er-다이어그램)
   - [Gantt Chart](#8-gantt-chart-간트-차트)
   - [User Journey](#9-user-journey-사용자-여정)
   - [Wireframe](#10-wireframe-와이어프레임)
4. [Wireframe 컴포넌트 완전 레퍼런스](#wireframe-컴포넌트-완전-레퍼런스)
5. [프로젝트 기획 가이드](#프로젝트-기획-가이드)
6. [AI 활용 가이드](#ai-활용-가이드)
7. [예제 프로젝트](#예제-프로젝트)

---

## 시작하기

### 기본 사용법
1. `index.html` 파일을 브라우저에서 엽니다
2. 상단 탭에서 다이어그램 타입을 선택합니다
3. 왼쪽 에디터에 코드를 입력합니다
4. `Ctrl+Enter` 또는 렌더링 버튼을 클릭하여 결과를 확인합니다

### 파일 구조
```
wireframe/
├── index.html      # 메인 HTML (홈페이지)
├── style.css       # 스타일시트
├── parser.js       # 다이어그램 파서
├── renderer.js     # SVG 렌더러
├── app.js          # 앱 로직 및 컴포넌트 레퍼런스
└── README.md         # 이 문서
```

---

## 다이어그램 타입 개요

| 타입 | 용도 | 적합한 상황 |
|------|------|-------------|
| **Flowchart** | 프로세스 흐름, 알고리즘 | 비즈니스 로직, 의사결정 과정 |
| **Sequence** | 시스템 간 상호작용 | API 호출, 마이크로서비스 통신 |
| **State** | 상태 전이 | 주문 상태, 사용자 인증 상태 |
| **Mindmap** | 아이디어 계층 구조 | 브레인스토밍, 요구사항 정리 |
| **Pie** | 비율/분포 | 통계, 점유율 분석 |
| **Class** | 객체지향 설계 | 소프트웨어 아키텍처 |
| **ER** | 데이터베이스 설계 | DB 스키마, 테이블 관계 |
| **Gantt** | 구현 순서/의존성 | 태스크 우선순위, 병렬 작업 정의 |
| **Journey** | 사용자 경험 | UX 분석, 고객 여정 |
| **Wireframe** | UI 목업 | 화면 설계, 프로토타입 |

---

## 상세 문법 가이드

### 1. Flowchart (플로우차트)

프로세스 흐름, 의사결정 트리, 알고리즘을 시각화합니다.

#### 기본 구조
```
flowchart [방향]
    노드ID[텍스트] --> 다른노드ID[텍스트]
```

#### 방향 설정
| 코드 | 방향 | 설명 |
|------|------|------|
| `TD` | ↓ | Top to Down |
| `TB` | ↓ | Top to Bottom (TD와 동일) |
| `BT` | ↑ | Bottom to Top |
| `LR` | → | Left to Right |
| `RL` | ← | Right to Left |

#### 노드 형태
| 문법 | 형태 | 용도 |
|------|------|------|
| `A[텍스트]` | 사각형 | 일반 프로세스 |
| `A(텍스트)` | 둥근 사각형 | 시작/종료/터미널 |
| `A{텍스트}` | 다이아몬드 | 조건/판단 |
| `A((텍스트))` | 원형 | 연결점/데이터 |
| `A[[텍스트]]` | 서브루틴 박스 | 하위 프로세스 |

#### 연결선 (엣지)
| 문법 | 설명 |
|------|------|
| `A --> B` | 화살표 연결 |
| `A --- B` | 직선 연결 |
| `A -.-> B` | 점선 화살표 |
| `A ==> B` | 굵은 화살표 |
| `A -->|라벨| B` | 라벨 포함 연결 |

#### 예제: 로그인 프로세스
```
flowchart TD
    A[시작] --> B[로그인 페이지]
    B --> C{인증 확인}
    C -->|성공| D[대시보드]
    C -->|실패| E[에러 표시]
    E --> B
    D --> F[종료]
```

---

### 2. Sequence Diagram (시퀀스 다이어그램)

시스템 간의 메시지 교환을 시간 순서대로 표현합니다.

#### 기본 구조
```
sequenceDiagram
    participant A as 표시이름
    A ->> B: 메시지
```

#### 참여자 정의
| 문법 | 설명 |
|------|------|
| `participant ID as 이름` | 사각형 참여자 |
| `actor ID as 이름` | 사람 아이콘 참여자 |

#### 메시지 유형
| 문법 | 선 | 화살표 | 의미 |
|------|-----|--------|------|
| `A ->> B: msg` | 실선 | 채움 | 동기 요청 |
| `A -->> B: msg` | 점선 | 채움 | 동기 응답 |
| `A -> B: msg` | 실선 | 열림 | 비동기 메시지 |
| `A --> B: msg` | 점선 | 열림 | 반환값 |

#### 노트
```
Note left of A: 왼쪽 노트
Note right of B: 오른쪽 노트
Note over A,B: 여러 참여자에 걸친 노트
```

#### 예제: API 호출
```
sequenceDiagram
    participant C as Client
    participant S as Server
    participant D as Database

    C ->> S: POST /api/login
    S ->> D: SELECT * FROM users
    D -->> S: User data
    S -->> C: JWT Token
```

---

### 3. State Diagram (상태 다이어그램)

객체의 상태와 전이를 표현합니다.

#### 기본 구조
```
stateDiagram
    [*] --> 초기상태
    초기상태 --> 다음상태: 이벤트
    다음상태 --> [*]
```

#### 특수 상태
| 문법 | 의미 |
|------|------|
| `[*]` | 시작/종료 상태 (위치에 따라 자동 구분) |

#### 전이 문법
```
상태A --> 상태B           %% 단순 전이
상태A --> 상태B: 이벤트   %% 이벤트 포함
```

#### 예제: 주문 상태
```
stateDiagram
    [*] --> 주문접수
    주문접수 --> 결제대기: 주문확인
    결제대기 --> 결제완료: 결제성공
    결제대기 --> 주문취소: 결제실패
    결제완료 --> 배송중: 출고
    배송중 --> 배송완료: 수령확인
    배송완료 --> [*]
    주문취소 --> [*]
```

---

### 4. Mindmap (마인드맵)

아이디어의 계층적 구조를 시각화합니다.

#### 기본 구조
```
mindmap
    root((중심 주제))
        주제1
            세부항목
        주제2
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

#### 계층 표현
들여쓰기(공백/탭)로 계층을 구분합니다. 깊이에 따라 자동으로 가지가 연결됩니다.

#### 예제: 프로젝트 구조
```
mindmap
    root((웹 프로젝트))
        Frontend
            [React]
            [TypeScript]
            (상태관리)
        Backend
            [Node.js]
            [Express]
            (REST API)
        Database
            )PostgreSQL(
            )Redis(
```

---

### 5. Pie Chart (파이 차트)

비율과 분포를 원형 차트로 표현합니다.

#### 기본 구조
```
pie showData title 제목
    "항목명" : 값
```

#### 옵션
| 옵션 | 설명 |
|------|------|
| `showData` | 각 조각에 퍼센트 표시 |
| `title 제목` | 차트 제목 설정 |

#### 예제: 시장 점유율
```
pie showData title 브라우저 점유율 2024
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 8
    "Edge" : 5
    "기타" : 3
```

---

### 6. Class Diagram (클래스 다이어그램)

객체지향 설계의 클래스 구조를 표현합니다.

#### 기본 구조
```
classDiagram
    class ClassName
    ClassName : +attribute
    ClassName : +method()
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
| `A <\|-- B` | 상속 | B extends A |
| `A *-- B` | 컴포지션 | A has B (강한 결합) |
| `A o-- B` | 집합 | A has B (약한 결합) |
| `A --> B` | 연관 | A uses B |
| `A <.. B` | 의존 | B depends on A |

#### 예제: MVC 패턴
```
classDiagram
    Controller --> Model
    Controller --> View
    View <.. Model

    class Model {
        -data: Object
        +getData()
        +setData()
    }
    class View {
        +render()
        +update()
    }
    class Controller {
        -model: Model
        -view: View
        +handleInput()
    }
```

---

### 7. ER Diagram (ER 다이어그램)

데이터베이스의 엔티티와 관계를 표현합니다.

#### 기본 구조
```
erDiagram
    ENTITY1 ||--o{ ENTITY2 : relationship
    ENTITY {
        type attribute PK
    }
```

#### 카디널리티
| 왼쪽 | 오른쪽 | 의미 |
|------|--------|------|
| `\|\|` | `\|\|` | one to one |
| `\|\|` | `o{` | one to many (0..n) |
| `\|\|` | `\|{` | one to many (1..n) |
| `o\|` | `o{` | zero or one to many |

#### 속성 키
| 키 | 의미 |
|-----|------|
| `PK` | Primary Key |
| `FK` | Foreign Key |
| `UK` | Unique Key |

#### 예제: 이커머스 DB
```
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
    CATEGORY ||--o{ PRODUCT : has

    USER {
        int id PK
        string email UK
        string password
        string name
    }
    ORDER {
        int id PK
        int user_id FK
        datetime created_at
        string status
    }
    PRODUCT {
        int id PK
        string name
        decimal price
        int category_id FK
    }
```

---

### 8. Gantt Chart (간트 차트)

**구현 순서와 의존성**을 시각화합니다. AI가 개발 태스크의 순서를 정할 때 사용합니다.

#### 핵심 용도
- 어떤 작업을 먼저 해야 하는지 (의존성)
- 병렬로 진행할 수 있는 작업은 무엇인지
- 어떤 작업이 핵심(critical path)인지

#### 기본 구조
```
gantt
    title 구현 계획
    dateFormat YYYY-MM-DD

    section 단계명
    태스크명 : 상태, 시작점, 상대적크기
```

#### 태스크 상태 (우선순위/중요도로 활용)
| 상태 | 색상 | AI 해석 |
|------|------|---------|
| (없음) | 파랑 | 일반 태스크 |
| `done` | 초록 | 선행 완료 필요 (의존성 있음) |
| `active` | 노랑 | 현재 구현 대상 |
| `crit` | 빨강 | 핵심 경로 (반드시 먼저) |

#### 순서 표현
- 같은 시작점 = 병렬 구현 가능
- 다른 시작점 = 순차 구현 (앞 작업 완료 후)
- `crit` = 다른 작업이 의존하는 핵심 작업

#### 예제: 기능 구현 순서
```
gantt
    title 회원 기능 구현 순서
    dateFormat YYYY-MM-DD

    section 1. 기반 작업
    DB 스키마 설계 : crit, 2024-01-01, 2d
    API 인터페이스 정의 : crit, 2024-01-01, 2d

    section 2. 핵심 기능
    회원가입 API : active, 2024-01-03, 3d
    로그인 API : active, 2024-01-03, 3d
    JWT 인증 미들웨어 : crit, 2024-01-03, 2d

    section 3. 부가 기능
    비밀번호 재설정 : 2024-01-06, 2d
    프로필 수정 : 2024-01-06, 2d
    회원 탈퇴 : 2024-01-06, 1d

    section 4. 프론트엔드
    로그인 페이지 : 2024-01-05, 3d
    회원가입 폼 : 2024-01-05, 3d
    마이페이지 : 2024-01-08, 2d
```

#### AI를 위한 해석 가이드
위 예제에서:
1. **먼저**: DB 스키마, API 인터페이스 (crit - 다른 모든 작업의 기반)
2. **그 다음**: 회원가입/로그인 API, JWT 미들웨어 (핵심 기능)
3. **병렬 가능**: 비밀번호 재설정, 프로필 수정, 회원 탈퇴 (서로 독립적)
4. **프론트엔드**: API 완료 후 진행 (의존성)

---

### 9. User Journey (사용자 여정)

사용자 경험을 감정 점수와 함께 표현합니다.

#### 기본 구조
```
journey
    title 여정 제목

    section 단계명
    태스크: 점수: 액터들
```

#### 점수 체계
| 점수 | 감정 | 색상 |
|------|------|------|
| 1-2 | 부정적 | 빨강 |
| 3 | 보통 | 노랑 |
| 4-5 | 긍정적 | 초록 |

#### 예제: 온보딩 경험
```
journey
    title 신규 사용자 온보딩

    section 가입
    앱 다운로드: 5: 사용자
    회원가입: 3: 사용자
    이메일 인증: 2: 사용자

    section 설정
    프로필 작성: 4: 사용자
    관심사 선택: 5: 사용자

    section 첫 사용
    튜토리얼: 4: 사용자
    첫 게시물: 5: 사용자
```

---

### 10. Wireframe (와이어프레임)

UI 목업과 화면 레이아웃을 설계합니다.

#### 기본 구조
```
wireframe 화면제목
    컴포넌트타입 "옵션" x,y,width,height
```

#### 좌표 시스템
- x, y: 왼쪽 상단 기준 위치 (px)
- width, height: 컴포넌트 크기 (px)
- 캔버스 기본 크기: 800x600

#### 기본 예제
```
wireframe 로그인 화면
    header "My App" 0,0,800,60
    label "이메일" 200,150,400,20
    input "email@example.com" 200,175,400,40
    label "비밀번호" 200,235,400,20
    password "********" 200,260,400,40
    button "로그인" 200,330,400,50
```

---

## Wireframe 컴포넌트 완전 레퍼런스

### 구조 컴포넌트

#### header - 헤더
```
header "제목" x,y,width,height
```
화면 상단의 앱 헤더/네비게이션 바

#### card - 카드
```
card "제목" x,y,width,height
```
그림자가 있는 콘텐츠 카드 컨테이너

#### box - 박스
```
box "" x,y,width,height
```
기본 사각형 컨테이너 (테두리만)

#### divider - 구분선
```
divider "" x,y,width,0
```
수평 구분선 (height는 무시됨)

#### spacer - 여백
```
spacer "" x,y,width,height
```
빈 공간 (점선 테두리로 표시)

---

### 폼 컴포넌트

#### input - 텍스트 입력
```
input "placeholder" x,y,width,height
```
단일 라인 텍스트 입력 필드

#### textarea - 멀티라인 입력
```
textarea "placeholder" x,y,width,height
```
여러 줄 텍스트 입력 영역

#### password - 비밀번호
```
password "********" x,y,width,height
```
마스킹된 비밀번호 필드 (●●●●)

#### button - 버튼
```
button "텍스트" x,y,width,height
```
기본 액션 버튼 (파란 배경)

#### checkbox - 체크박스
```
checkbox "라벨" x,y,width,height
```
체크 표시가 있는 선택 박스

#### radio - 라디오 버튼
```
radio "라벨" x,y,width,height
```
단일 선택 라디오 버튼

#### toggle - 토글 스위치
```
toggle "라벨" x,y,width,height
```
ON/OFF 토글 스위치

#### select - 드롭다운
```
select "선택하세요" x,y,width,height
```
드롭다운 선택 메뉴 (▼ 아이콘)

#### slider - 슬라이더
```
slider "50" x,y,width,height
```
범위 선택 슬라이더 (0-100)

#### file - 파일 업로드
```
file "파일 선택" x,y,width,height
```
파일 업로드 버튼

#### date - 날짜 선택
```
date "2024-01-01" x,y,width,height
```
날짜 선택 필드 (📅 아이콘)

#### time - 시간 선택
```
time "09:00" x,y,width,height
```
시간 선택 필드 (🕐 아이콘)

#### color - 색상 선택
```
color "#3498db" x,y,width,height
```
색상 피커 (미리보기 포함)

---

### 데이터 표시 컴포넌트

#### label - 라벨
```
label "텍스트" x,y,width,height
```
일반 텍스트 라벨

#### text - 텍스트
```
text "내용" x,y,width,height
```
본문 텍스트

#### heading - 제목
```
heading "H1 제목" x,y,width,height
```
큰 제목 텍스트 (굵게)

#### paragraph - 문단
```
paragraph "긴 텍스트..." x,y,width,height
```
문단 텍스트 (회색)

#### quote - 인용문
```
quote "인용 내용" x,y,width,height
```
왼쪽에 바가 있는 인용문

#### badge - 뱃지
```
badge "NEW" x,y,width,height
```
상태/알림 표시 뱃지

#### tag - 태그
```
tag "태그명" x,y,width,height
```
키워드 태그

#### chip - 칩
```
chip "Chip" x,y,width,height
```
삭제 가능한 필터 칩 (× 아이콘)

#### avatar - 아바타
```
avatar "이름" x,y,width,height
```
사용자 아바타 (원형, 이니셜)

#### icon - 아이콘
```
icon "star" x,y,width,height
```
아이콘 표시 (star, heart, user, home, search, menu, close, check, plus, minus)

#### stats - 통계
```
stats "1,234|Users" x,y,width,height
```
큰 숫자 통계 (숫자|라벨 형식)

---

### 네비게이션 컴포넌트

#### nav - 네비게이션 바
```
nav "메뉴1,메뉴2,메뉴3" x,y,width,height
```
상단 네비게이션 메뉴

#### tabs - 탭
```
tabs "탭1,탭2,탭3" x,y,width,height
```
탭 네비게이션 (첫 번째 활성화)

#### breadcrumb - 브레드크럼
```
breadcrumb "홈,카테고리,상세" x,y,width,height
```
경로 표시 (> 구분자)

#### stepper - 스텝퍼
```
stepper "정보입력,결제,완료" x,y,width,height
```
단계 진행 표시

#### pagination - 페이지네이션
```
pagination "5" x,y,width,height
```
페이지 번호 표시 (총 페이지 수)

#### link - 링크
```
link "클릭하세요" x,y,width,height
```
하이퍼링크 스타일 텍스트

---

### 컨테이너 컴포넌트

#### table - 테이블
```
table "헤더1,헤더2,헤더3" x,y,width,height
```
데이터 테이블 (3행 샘플)

#### list - 리스트
```
list "항목1,항목2,항목3" x,y,width,height
```
세로 목록 (구분선 포함)

#### form - 폼
```
form "폼 제목" x,y,width,height
```
폼 컨테이너 (배경색 포함)

#### modal - 모달
```
modal "모달 제목" x,y,width,height
```
모달 다이얼로그 (닫기 버튼)

#### accordion - 아코디언
```
accordion "섹션1,섹션2,섹션3" x,y,width,height
```
접히는 섹션들

#### tooltip - 툴팁
```
tooltip "도움말 내용" x,y,width,height
```
말풍선 형태 툴팁

#### calendar - 캘린더
```
calendar "2024-01" x,y,width,height
```
월간 달력 그리드

---

### 미디어 컴포넌트

#### image - 이미지
```
image "설명" x,y,width,height
```
이미지 플레이스홀더 (산 아이콘)

#### video - 비디오
```
video "제목" x,y,width,height
```
비디오 플레이스홀더 (재생 버튼)

#### map - 지도
```
map "위치" x,y,width,height
```
지도 플레이스홀더 (격자)

#### carousel - 캐러셀
```
carousel "3" x,y,width,height
```
이미지 슬라이더 (슬라이드 수)

---

### 피드백 컴포넌트

#### alert - 알림
```
alert "success:성공 메시지" x,y,width,height
alert "error:에러 메시지" x,y,width,height
alert "warning:경고 메시지" x,y,width,height
alert "info:정보 메시지" x,y,width,height
```
상태별 알림 박스

#### progress - 프로그레스 바
```
progress "75" x,y,width,height
```
진행률 표시 (0-100)

#### rating - 별점
```
rating "4" x,y,width,height
```
별점 표시 (1-5)

#### skeleton - 스켈레톤
```
skeleton "" x,y,width,height
```
로딩 플레이스홀더

---

### 기타 컴포넌트

#### timeline - 타임라인
```
timeline "이벤트1,이벤트2,이벤트3" x,y,width,height
```
세로 타임라인

#### social - 소셜 공유
```
social "" x,y,width,height
```
소셜 미디어 아이콘들

#### search - 검색창
```
search "검색어 입력" x,y,width,height
```
검색 입력 필드 (돋보기 아이콘)

#### footer - 푸터
```
footer "© 2024 Company" x,y,width,height
```
페이지 하단 푸터

---

## 프로젝트 기획 가이드

이 다이어그램 에디터를 사용하여 프로젝트를 체계적으로 기획하는 방법입니다.

### 단계 1: 요구사항 분석 (Mindmap)

프로젝트 범위와 기능을 브레인스토밍합니다.

```
mindmap
    root((프로젝트명))
        핵심 기능
            기능1
            기능2
        사용자
            일반 사용자
            관리자
        기술 스택
            Frontend
            Backend
        일정
            Phase 1
            Phase 2
```

### 단계 2: 데이터 모델링 (ER Diagram)

데이터베이스 구조를 설계합니다.

```
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
```

### 단계 3: 시스템 설계 (Sequence + Class Diagram)

시스템 아키텍처와 상호작용을 정의합니다.

**API 흐름 (Sequence):**
```
sequenceDiagram
    participant Client
    participant API
    participant DB
    Client ->> API: Request
    API ->> DB: Query
    DB -->> API: Result
    API -->> Client: Response
```

**코드 구조 (Class):**
```
classDiagram
    Controller --> Service
    Service --> Repository
    Repository --> Database
```

### 단계 4: UI/UX 설계 (Wireframe + Journey)

사용자 인터페이스와 경험을 설계합니다.

**화면 설계 (Wireframe):**
```
wireframe 메인 화면
    header "My App" 0,0,800,60
    nav "홈,상품,장바구니,마이페이지" 0,60,800,40
    card "추천 상품" 20,120,760,400
```

**사용자 여정 (Journey):**
```
journey
    title 구매 여정
    section 탐색
    상품 검색: 4: 고객
    section 구매
    장바구니: 5: 고객
    결제: 3: 고객
```

### 단계 5: 구현 순서 (Gantt)

개발 태스크의 **순서와 의존성**을 정의합니다.

```
gantt
    title 구현 순서
    dateFormat YYYY-MM-DD

    section 1. 기반
    DB 스키마 : crit, 2024-01-01, 2d
    API 설계 : crit, 2024-01-01, 2d

    section 2. 백엔드
    인증 API : active, 2024-01-03, 3d
    비즈니스 로직 : 2024-01-06, 5d

    section 3. 프론트엔드
    UI 컴포넌트 : 2024-01-03, 3d
    페이지 연동 : 2024-01-06, 5d

    section 4. 검증
    통합 테스트 : crit, 2024-01-11, 2d
```

**해석**: crit(빨강) → active(노랑) → 일반(파랑) 순서로 구현

### 단계 6: 비즈니스 프로세스 (Flowchart + State)

핵심 비즈니스 로직을 문서화합니다.

**결제 프로세스 (Flowchart):**
```
flowchart TD
    A[장바구니] --> B{재고 확인}
    B -->|있음| C[결제 페이지]
    B -->|없음| D[품절 알림]
    C --> E{결제 성공?}
    E -->|Yes| F[주문 완료]
    E -->|No| G[재시도]
```

**주문 상태 (State):**
```
stateDiagram
    [*] --> 주문접수
    주문접수 --> 결제완료
    결제완료 --> 배송중
    배송중 --> 배송완료
    배송완료 --> [*]
```

---

## AI 활용 가이드

### 프롬프트 예시

1. **기능 설계 요청**
   > "사용자 인증 기능의 Flowchart를 그려줘. 소셜 로그인과 이메일 인증 포함해서."

2. **DB 설계 요청**
   > "이커머스 앱의 ER 다이어그램을 그려줘. User, Product, Order, Review 테이블 포함."

3. **API 설계 요청**
   > "회원가입 API의 Sequence Diagram을 그려줘. 이메일 중복 체크와 인증 메일 발송 포함."

4. **UI 설계 요청**
   > "모바일 쇼핑앱의 상품 상세 페이지 Wireframe을 그려줘. 이미지, 가격, 구매 버튼 포함."

5. **구현 순서 요청**
   > "회원 기능 구현 순서를 Gantt로 그려줘. 어떤 작업을 먼저 해야 하는지, 병렬로 할 수 있는 건 뭔지 표시해줘."

### AI가 다이어그램을 생성할 때 주의사항

1. **문법 정확성**: 각 다이어그램의 선언문(flowchart, sequenceDiagram 등)으로 시작
2. **좌표 계산**: Wireframe에서 컴포넌트가 겹치지 않도록 y 좌표 계산
3. **일관성**: 같은 엔티티는 같은 이름으로 참조
4. **가독성**: 적절한 주석(%%)과 섹션 구분 사용

---

## 예제 프로젝트

### 이커머스 앱 - 전체 기획 예시

#### 1. 프로젝트 구조 (Mindmap)
```
mindmap
    root((이커머스 앱))
        사용자 기능
            [회원가입/로그인]
            [상품 검색]
            [장바구니]
            [주문/결제]
            [리뷰 작성]
        관리자 기능
            [상품 관리]
            [주문 관리]
            [회원 관리]
        기술 스택
            (React)
            (Node.js)
            (PostgreSQL)
            (Redis)
```

#### 2. 데이터베이스 (ER Diagram)
```
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ CART : has
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
    PRODUCT ||--o{ REVIEW : has
    PRODUCT ||--o{ CART_ITEM : in
    CART ||--|{ CART_ITEM : contains
    CATEGORY ||--o{ PRODUCT : categorizes

    USER {
        int id PK
        string email UK
        string password
        string name
        string phone
        datetime created_at
    }
    PRODUCT {
        int id PK
        string name
        text description
        decimal price
        int stock
        int category_id FK
    }
    ORDER {
        int id PK
        int user_id FK
        decimal total_amount
        string status
        datetime created_at
    }
```

#### 3. 결제 프로세스 (Flowchart)
```
flowchart TD
    A[장바구니] --> B{로그인 확인}
    B -->|No| C[로그인 페이지]
    C --> B
    B -->|Yes| D[배송지 입력]
    D --> E[결제 수단 선택]
    E --> F{결제 처리}
    F -->|성공| G[주문 완료]
    F -->|실패| H[에러 표시]
    H --> E
    G --> I[주문 확인 메일]
    I --> J[끝]
```

#### 4. API 흐름 (Sequence Diagram)
```
sequenceDiagram
    participant C as Client
    participant A as API Server
    participant P as Payment
    participant D as Database

    C ->> A: POST /orders
    A ->> D: Check Stock
    D -->> A: Stock OK
    A ->> P: Process Payment
    P -->> A: Payment Success
    A ->> D: Create Order
    D -->> A: Order Created
    A -->> C: Order Confirmation
```

#### 5. 주문 상태 (State Diagram)
```
stateDiagram
    [*] --> 주문접수
    주문접수 --> 결제대기: 주문확인
    결제대기 --> 결제완료: 결제성공
    결제대기 --> 주문취소: 결제실패
    결제완료 --> 상품준비: 결제확인
    상품준비 --> 배송중: 출고완료
    배송중 --> 배송완료: 배송완료
    배송완료 --> [*]
    주문취소 --> [*]
```

#### 6. 구현 순서 (Gantt Chart)

**AI가 참고할 구현 순서와 의존성:**

```
gantt
    title 이커머스 앱 구현 순서
    dateFormat YYYY-MM-DD

    section 1. 기반 (먼저)
    DB 스키마 설계 : crit, 2024-01-01, 2d
    API 인터페이스 정의 : crit, 2024-01-01, 2d

    section 2. 핵심 백엔드
    인증 API : crit, 2024-01-03, 3d
    상품 CRUD API : active, 2024-01-03, 3d
    주문 API : active, 2024-01-06, 4d
    결제 연동 : 2024-01-10, 3d

    section 3. 프론트엔드 (병렬)
    공통 UI 컴포넌트 : 2024-01-03, 3d
    상품 목록/상세 : 2024-01-06, 4d
    장바구니/결제 : 2024-01-10, 4d

    section 4. 통합
    API 연동 : crit, 2024-01-14, 3d
    E2E 테스트 : 2024-01-17, 2d
```

**구현 순서 해석:**
1. crit(빨강): DB, API 정의, 인증 → 모든 기능의 기반
2. active(노랑): 상품/주문 API → 핵심 비즈니스 로직
3. 일반(파랑): 결제, UI, 테스트 → 병렬 또는 후순위

#### 7. 사용자 여정 (User Journey)
```
journey
    title 첫 구매 경험

    section 탐색
    앱 설치: 5: 고객
    회원가입: 3: 고객
    상품 검색: 4: 고객

    section 선택
    상품 상세 확인: 4: 고객
    리뷰 확인: 5: 고객
    장바구니 담기: 5: 고객

    section 구매
    배송지 입력: 3: 고객
    결제: 3: 고객
    결제 완료: 5: 고객

    section 사후
    배송 추적: 4: 고객
    상품 수령: 5: 고객
    리뷰 작성: 4: 고객
```

#### 8. UI 화면 설계 (Wireframe)

**홈 화면:**
```
wireframe 홈 화면
    header "쇼핑몰" 0,0,400,50
    search "상품 검색" 20,60,360,40
    carousel "3" 20,120,360,180
    heading "추천 상품" 20,320,360,30
    card "상품 1" 20,360,170,150
    card "상품 2" 210,360,170,150
    nav "홈,검색,장바구니,마이페이지" 0,550,400,50
```

**상품 상세:**
```
wireframe 상품 상세
    header "상품명" 0,0,400,50
    image "상품 이미지" 0,50,400,300
    heading "프리미엄 상품" 20,360,360,30
    text "₩99,000" 20,395,150,25
    rating "4" 200,395,100,25
    divider "" 20,430,360,0
    paragraph "상품 설명이 여기에 표시됩니다. 자세한 정보를 확인하세요." 20,450,360,60
    button "장바구니 담기" 20,530,175,45
    button "바로 구매" 205,530,175,45
```

**장바구니:**
```
wireframe 장바구니
    header "장바구니" 0,0,400,50
    card "상품 1" 20,70,360,80
    checkbox "선택" 30,90,20,20
    text "상품명 1" 60,85,200,20
    text "₩50,000" 60,110,100,20
    stepper "수량,+,-" 280,95,70,30
    card "상품 2" 20,170,360,80
    divider "" 20,280,360,0
    text "총 결제금액" 20,300,150,25
    text "₩150,000" 230,300,150,25
    button "결제하기" 20,350,360,50
```

---

## 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl + Enter` | 렌더링 실행 |
| `Tab` | 들여쓰기 |
| `Esc` | 사이드바/도움말 닫기 |

---

## 내보내기

### SVG 저장
- 벡터 형식 (무한 확대 가능)
- 웹 삽입에 최적
- 편집 소프트웨어 호환

### PNG 저장
- 래스터 이미지 (2배 해상도)
- 문서/프레젠테이션용
- 범용 이미지 포맷

---

## 주석 사용

모든 다이어그램에서 `%%`로 시작하는 줄은 주석입니다:

```
flowchart TD
    %% 이것은 주석입니다
    A --> B  %% 인라인 주석도 가능
```

---

## 지원 브라우저

- Chrome (권장)
- Firefox
- Safari
- Edge

---

## 라이선스

MIT License
