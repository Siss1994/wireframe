/**
 * Diagram Editor - Main Application
 */

// 예제 데이터
const EXAMPLES = {
    flowchart: [
        {
            name: '기본 플로우차트',
            description: '간단한 프로세스 흐름 예제',
            code: `flowchart TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[처리 실행]
    B -->|No| D[대안 처리]
    C --> E[완료]
    D --> E`
        },
        {
            name: '사용자 인증 흐름',
            description: '로그인 프로세스 다이어그램',
            code: `flowchart TD
    Start[사용자 접속] --> Login[로그인 페이지]
    Login --> Check{인증 확인}
    Check -->|성공| Dashboard[대시보드]
    Check -->|실패| Error[에러 메시지]
    Error --> Login
    Dashboard --> End[세션 종료]`
        },
        {
            name: '수평 레이아웃',
            description: '좌에서 우로 흐르는 차트',
            code: `flowchart LR
    Input[입력] --> Process((처리))
    Process --> Decision{판단}
    Decision --> Output1[출력 A]
    Decision --> Output2[출력 B]`
        }
    ],
    sequence: [
        {
            name: 'API 요청 흐름',
            description: '클라이언트-서버 통신 예제',
            code: `sequenceDiagram
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as 데이터베이스

    Client ->> Server: API 요청
    Server ->> DB: 쿼리 실행
    DB -->> Server: 결과 반환
    Server -->> Client: JSON 응답`
        },
        {
            name: '주문 처리 시퀀스',
            description: '온라인 주문 처리 과정',
            code: `sequenceDiagram
    participant User as 사용자
    participant Cart as 장바구니
    participant Payment as 결제
    participant Order as 주문

    User ->> Cart: 상품 추가
    Cart -->> User: 장바구니 업데이트
    User ->> Payment: 결제 요청
    Payment ->> Payment: 결제 처리
    Payment -->> User: 결제 완료
    Payment ->> Order: 주문 생성
    Order -->> User: 주문 확인`
        },
        {
            name: '채팅 메시지',
            description: '실시간 채팅 시스템',
            code: `sequenceDiagram
    participant A as Alice
    participant S as Server
    participant B as Bob

    A ->> S: 메시지 전송
    S ->> B: 메시지 전달
    B -->> S: 수신 확인
    S -->> A: 전달 완료`
        }
    ],
    state: [
        {
            name: '주문 상태',
            description: '주문 상태 변화 다이어그램',
            code: `stateDiagram
    [*] --> 대기중
    대기중 --> 처리중: 주문 접수
    처리중 --> 배송중: 발송
    배송중 --> 완료: 배송 완료
    처리중 --> 취소됨: 취소 요청
    완료 --> [*]
    취소됨 --> [*]`
        },
        {
            name: '작업 상태',
            description: 'Task 상태 관리',
            code: `stateDiagram
    [*] --> TODO
    TODO --> InProgress: 시작
    InProgress --> Review: 완료
    Review --> Done: 승인
    Review --> InProgress: 수정 요청
    Done --> [*]`
        },
        {
            name: '연결 상태',
            description: '네트워크 연결 상태',
            code: `stateDiagram
    [*] --> Disconnected
    Disconnected --> Connecting: connect
    Connecting --> Connected: success
    Connecting --> Disconnected: fail
    Connected --> Disconnected: disconnect`
        }
    ],
    mindmap: [
        {
            name: '프로젝트 구조',
            description: '프로젝트 계획 마인드맵',
            code: `mindmap
    root((프로젝트))
        기획
            요구사항 분석
            일정 수립
        디자인
            UI 설계
            UX 연구
        개발
            프론트엔드
            백엔드
            테스트
        배포
            스테이징
            프로덕션`
        },
        {
            name: '학습 계획',
            description: '학습 주제 구조화',
            code: `mindmap
    root((웹 개발))
        프론트엔드
            HTML
            CSS
            JavaScript
                React
                Vue
        백엔드
            Node.js
            Python
            Database
        DevOps
            Docker
            CI/CD`
        },
        {
            name: '브레인스토밍',
            description: '아이디어 정리',
            code: `mindmap
    root((새 앱 아이디어))
        사용자
            [일반 사용자]
            [관리자]
        기능
            (회원가입)
            (로그인)
            (대시보드)
        기술
            React
            Node.js
            MongoDB`
        }
    ],
    pie: [
        {
            name: '시장 점유율',
            description: '브라우저 시장 점유율',
            code: `pie showData title 브라우저 시장 점유율
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 8
    "Edge" : 5
    "기타" : 3`
        },
        {
            name: '프로젝트 예산',
            description: '부서별 예산 배분',
            code: `pie title 부서별 예산 배분
    "개발" : 40
    "마케팅" : 25
    "운영" : 20
    "인사" : 15`
        }
    ],
    class: [
        {
            name: '동물 클래스',
            description: '상속 관계 예제',
            code: `classDiagram
    Animal <|-- Dog
    Animal <|-- Cat
    Animal : +String name
    Animal : +int age
    Animal : +makeSound()
    Dog : +String breed
    Dog : +bark()
    Cat : +String color
    Cat : +meow()`
        },
        {
            name: '주문 시스템',
            description: 'e커머스 클래스 다이어그램',
            code: `classDiagram
    Customer "1" --> "*" Order
    Order *-- OrderItem
    Order o-- Payment
    Customer : +String name
    Customer : +String email
    Customer : +placeOrder()
    Order : +Date orderDate
    Order : +getTotal()
    OrderItem : +int quantity
    Payment : +processPayment()`
        }
    ],
    er: [
        {
            name: '사용자-주문',
            description: '기본 ER 다이어그램',
            code: `erDiagram
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
    PRODUCT {
        int id PK
        string name
        float price
    }`
        },
        {
            name: '블로그 시스템',
            description: '블로그 데이터베이스 설계',
            code: `erDiagram
    USER ||--o{ POST : writes
    POST ||--o{ COMMENT : has
    USER ||--o{ COMMENT : writes
    POST }o--o{ TAG : tagged

    USER {
        int id PK
        string username UK
        string password
    }
    POST {
        int id PK
        string title
        text content
    }`
        }
    ],
    gantt: [
        {
            name: '프로젝트 일정',
            description: '소프트웨어 개발 일정',
            code: `gantt
    title 프로젝트 개발 일정
    dateFormat YYYY-MM-DD

    section 기획
    요구사항 분석 : done, 2024-01-01, 7d
    기획서 작성 : done, 2024-01-08, 5d

    section 설계
    시스템 설계 : active, 2024-01-13, 7d
    DB 설계 : 2024-01-15, 5d

    section 개발
    백엔드 개발 : 2024-01-20, 14d
    프론트엔드 개발 : 2024-01-22, 14d

    section 테스트
    통합 테스트 : crit, 2024-02-05, 7d
    배포 : 2024-02-12, 2d`
        },
        {
            name: '마케팅 캠페인',
            description: '캠페인 진행 일정',
            code: `gantt
    title 마케팅 캠페인 일정
    dateFormat YYYY-MM-DD

    section 준비
    시장 조사 : 2024-01-01, 5d
    전략 수립 : 2024-01-06, 3d

    section 실행
    콘텐츠 제작 : 2024-01-09, 7d
    광고 집행 : 2024-01-16, 14d

    section 분석
    성과 분석 : 2024-01-30, 5d`
        }
    ],
    journey: [
        {
            name: '쇼핑 경험',
            description: '온라인 쇼핑 사용자 여정',
            code: `journey
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
    리뷰 작성: 3: 고객`
        },
        {
            name: '고객 지원',
            description: '고객 서비스 이용 여정',
            code: `journey
    title 고객 지원 경험

    section 문의
    문제 발생: 1: 고객
    FAQ 검색: 3: 고객
    채팅 상담: 4: 고객, 상담원

    section 해결
    문제 접수: 3: 상담원
    해결책 제시: 4: 상담원
    문제 해결: 5: 고객, 상담원`
        }
    ],
    wireframe: [
        {
            name: '컴포넌트 가이드',
            description: '사용 가능한 모든 컴포넌트 모음',
            code: `wireframe 컴포넌트 가이드
    device desktop

    header
        logo "Component Guide"
        nav "폼" "데이터" "네비" "기타"
    end

    section 폼 컴포넌트
        input text "텍스트 입력"
        input email "이메일 입력"
        textarea "여러 줄 입력..."
        dropdown "선택하세요"
        checkbox "체크박스 옵션"
        radio "라디오 옵션 A"
        radio "라디오 옵션 B" checked
        toggle "알림 설정" on
        slider 65 "볼륨"
        date "날짜 선택"
        time "시간 선택"
        file "파일을 드래그하거나 클릭"
        color "테마 색상"
        button primary "저장하기"
        button secondary "취소"
    end

    section 데이터 표시
        heading 1 "큰 제목 (H1)"
        heading 2 "중간 제목 (H2)"
        paragraph "일반 텍스트 내용입니다."
        badge "New" green
        badge "Hot" red
        tag "태그1" blue
        tag "태그2" purple
        progress 75 "다운로드 진행률"
        rating 4.5
        stats "총 방문자" "12,345" user
        alert info "정보 알림 메시지입니다."
        alert success "성공 알림 메시지입니다."
        alert warning "경고 알림 메시지입니다."
        alert error "오류 알림 메시지입니다."
    end

    section 네비게이션
        breadcrumb "홈" "카테고리" "상품"
        tabs "전체" "인기" "최신" active:1
        stepper 2 "정보입력" "결제" "완료"
        pagination 1 2 3 ... 10
    end

    section 컨테이너
        accordion "자주 묻는 질문 1" "자주 묻는 질문 2"
        timeline "주문 접수" "배송 준비" "배송 중"
        carousel "배너 1" "배너 2" "배너 3"
        quote "좋은 디자인은 눈에 띄지 않는다." "Dieter Rams"
    end

    section 리스트
        list bullet "글머리 기호 항목 1" "글머리 기호 항목 2"
        list number "번호 매기기 항목 1" "번호 매기기 항목 2"
        list check "체크리스트 항목 1" "체크리스트 항목 2"
        chips "React" "Vue" "Angular" "Svelte"
    end

    section 미디어
        image placeholder
        video placeholder
        map placeholder
        skeleton text 2
        skeleton avatar 1
    end

    section 소셜/기타
        social facebook twitter instagram linkedin github
        calendar
    end

    footer
        text "© 2024 Component Guide"
    end`
        },
        {
            name: '로그인 페이지',
            description: '기본 로그인 화면 와이어프레임',
            code: `wireframe 로그인 페이지
    device mobile

    header
        logo "MyApp"
        nav "메뉴"
    end

    section 로그인 폼
        text "로그인"
        input email "이메일 주소"
        input password "비밀번호"
        checkbox "로그인 상태 유지"
        button primary "로그인"
        link "비밀번호 찾기"
        divider "또는"
        button secondary "Google로 로그인"
        button secondary "Kakao로 로그인"
    end

    footer
        link "회원가입"
        link "고객센터"
    end`
        },
        {
            name: '대시보드',
            description: '관리자 대시보드 와이어프레임',
            code: `wireframe 대시보드
    device desktop

    header
        logo "Admin"
        nav "대시보드" "사용자" "설정"
        avatar "관리자"
    end

    sidebar
        menu "홈" active
        menu "분석"
        menu "주문"
        menu "상품"
        menu "고객"
        divider
        menu "설정"
    end

    section 통계
        card "총 매출" "₩12,450,000" "+12%"
        card "주문수" "324" "+8%"
        card "방문자" "1,234" "-3%"
        card "전환율" "3.2%" "+0.5%"
    end

    section 차트
        chart bar "월별 매출"
        chart line "일별 방문자"
    end

    section 최근 주문
        table "주문번호" "고객" "금액" "상태"
    end`
        },
        {
            name: '상품 목록',
            description: '이커머스 상품 목록 페이지',
            code: `wireframe 상품 목록
    device tablet

    header
        logo "Shop"
        search "상품 검색..."
        icon cart
        icon user
    end

    section 필터
        dropdown "카테고리"
        dropdown "가격대"
        dropdown "정렬"
    end

    section 상품 그리드
        product "상품 1" "₩29,000" star 4.5
        product "상품 2" "₩39,000" star 4.8
        product "상품 3" "₩19,000" star 4.2
        product "상품 4" "₩49,000" star 4.9
        product "상품 5" "₩25,000" star 4.0
        product "상품 6" "₩35,000" star 4.7
    end

    pagination 1 2 3 ... 10

    footer
        link "이용약관"
        link "개인정보처리방침"
        text "© 2024 Shop"
    end`
        },
        {
            name: '모바일 앱 화면',
            description: '소셜 미디어 피드 화면',
            code: `wireframe 피드
    device mobile

    statusbar

    header
        logo "Social"
        icon search
        icon message
    end

    section 스토리
        avatar "내 스토리" add
        avatar "user1"
        avatar "user2"
        avatar "user3"
    end

    section 피드
        post
            avatar "username1"
            image placeholder
            icons heart comment share bookmark
            text "좋아요 128개"
            text "첫 번째 게시물입니다..."
        end
        post
            avatar "username2"
            image placeholder
            icons heart comment share bookmark
            text "좋아요 256개"
            text "두 번째 게시물..."
        end
    end

    bottomnav
        icon home active
        icon search
        icon add
        icon heart
        icon user
    end`
        },
        {
            name: '설정 페이지',
            description: '앱 설정 화면 예제',
            code: `wireframe 설정
    device mobile

    header
        logo "설정"
    end

    section 프로필
        avatar "홍길동"
        text "hong@email.com"
        button secondary "프로필 편집"
    end

    section 알림 설정
        toggle "푸시 알림" on
        toggle "이메일 알림"
        toggle "마케팅 알림"
    end

    section 앱 설정
        slider 80 "글자 크기"
        dropdown "언어 선택"
        toggle "다크 모드" on
        color "테마 색상"
    end

    section 기타
        list bullet "이용약관" "개인정보 처리방침" "오픈소스 라이선스"
        spacer 20
        alert info "버전 2.1.0"
    end

    footer
        button secondary "로그아웃"
    end`
        },
        {
            name: '주문 과정',
            description: '이커머스 결제 단계 예제',
            code: `wireframe 주문하기
    device tablet

    header
        logo "Shop"
        breadcrumb "장바구니" "정보입력" "결제"
    end

    section 진행 단계
        stepper 2 "장바구니" "정보입력" "결제" "완료"
    end

    section 배송 정보
        form "배송지 입력"
        input text "받는 분"
        input text "연락처"
        input text "주소"
        textarea "배송 메모..."
        checkbox "기본 배송지로 저장"
    end

    section 결제 수단
        tabs "카드" "계좌이체" "간편결제" active:0
        spacer 10
        dropdown "카드 선택"
        input text "카드 번호"
        date "유효기간"
        toggle "결제 정보 저장"
    end

    section 주문 요약
        card "상품 금액" "₩89,000" ""
        card "배송비" "무료" ""
        card "총 결제액" "₩89,000" ""
    end

    footer
        button primary "결제하기"
    end`
        }
    ]
};

// 문법 도움말
const SYNTAX_HELP = {
    flowchart: `<div class="help-section">
        <h4>방향 설정</h4>
        <pre><code>flowchart TD  %% 위에서 아래로
flowchart LR  %% 왼쪽에서 오른쪽으로</code></pre>
    </div>
    <div class="help-section">
        <h4>노드 형태</h4>
        <pre><code>A[사각형]
B(둥근 사각형)
C{다이아몬드}
D((원형))</code></pre>
    </div>
    <div class="help-section">
        <h4>연결</h4>
        <pre><code>A --> B     %% 화살표
A --- B     %% 직선
A -->|라벨| B  %% 라벨 포함</code></pre>
    </div>`,

    sequence: `<div class="help-section">
        <h4>참여자 정의</h4>
        <pre><code>participant A as 클라이언트
actor B as 사용자</code></pre>
    </div>
    <div class="help-section">
        <h4>메시지 유형</h4>
        <pre><code>A ->> B: 동기 메시지
A -->> B: 응답 (점선)
A -> B: 단순 메시지</code></pre>
    </div>
    <div class="help-section">
        <h4>노트</h4>
        <pre><code>Note over A,B: 설명 텍스트
Note right of A: 오른쪽 노트</code></pre>
    </div>`,

    state: `<div class="help-section">
        <h4>시작/종료</h4>
        <pre><code>[*] --> 첫상태   %% 시작
마지막 --> [*]   %% 종료</code></pre>
    </div>
    <div class="help-section">
        <h4>상태 전환</h4>
        <pre><code>상태A --> 상태B
상태A --> 상태B: 이벤트명</code></pre>
    </div>
    <div class="help-section">
        <h4>상태 설명</h4>
        <pre><code>state "설명 텍스트" as s1</code></pre>
    </div>`,

    mindmap: `<div class="help-section">
        <h4>루트 노드</h4>
        <pre><code>mindmap
    root((중심 주제))</code></pre>
    </div>
    <div class="help-section">
        <h4>노드 형태</h4>
        <pre><code>일반 텍스트
[사각형]
(둥근 사각형)
((원형))</code></pre>
    </div>
    <div class="help-section">
        <h4>계층 구조</h4>
        <pre><code>root((주제))
    레벨1 항목
        레벨2 항목
            레벨3 항목</code></pre>
    </div>`,

    pie: `<div class="help-section">
        <h4>기본 구조</h4>
        <pre><code>pie showData title 차트 제목
    "항목1" : 값1
    "항목2" : 값2</code></pre>
    </div>
    <div class="help-section">
        <h4>옵션</h4>
        <pre><code>showData  %% 퍼센트 표시
title 제목</code></pre>
    </div>`,

    class: `<div class="help-section">
        <h4>클래스 정의</h4>
        <pre><code>class ClassName
ClassName : +attribute
ClassName : +method()</code></pre>
    </div>
    <div class="help-section">
        <h4>관계</h4>
        <pre><code>A <|-- B  %% 상속
A *-- B   %% 컴포지션
A o-- B   %% 집합
A --> B   %% 연관</code></pre>
    </div>
    <div class="help-section">
        <h4>접근제어자</h4>
        <pre><code>+ public
- private
# protected
~ package</code></pre>
    </div>`,

    er: `<div class="help-section">
        <h4>관계 표현</h4>
        <pre><code>A ||--o{ B : 관계명
%% ||  : 1
%% o{  : 0 이상
%% |{  : 1 이상</code></pre>
    </div>
    <div class="help-section">
        <h4>엔티티 속성</h4>
        <pre><code>ENTITY {
    type name PK
    type name FK
}</code></pre>
    </div>`,

    gantt: `<div class="help-section">
        <h4>기본 구조</h4>
        <pre><code>gantt
    title 제목
    dateFormat YYYY-MM-DD

    section 섹션명
    태스크명 : 시작일, 기간</code></pre>
    </div>
    <div class="help-section">
        <h4>태스크 상태</h4>
        <pre><code>태스크 : done, 날짜, 5d
태스크 : active, 날짜, 3d
태스크 : crit, 날짜, 2d</code></pre>
    </div>`,

    journey: `<div class="help-section">
        <h4>기본 구조</h4>
        <pre><code>journey
    title 여정 제목

    section 단계명
    태스크: 점수: 액터</code></pre>
    </div>
    <div class="help-section">
        <h4>점수</h4>
        <pre><code>1-2: 부정적 경험 (빨강)
3: 보통 (노랑)
4-5: 긍정적 경험 (초록)</code></pre>
    </div>`,

    wireframe: `<div class="help-section">
        <h4>📱 기본 구조</h4>
        <pre><code>wireframe 페이지명
    device mobile|tablet|desktop

    header ... end
    sidebar ... end
    section 섹션명 ... end
    footer ... end</code></pre>
    </div>
    <div class="help-section">
        <h4>📝 폼 컴포넌트</h4>
        <pre><code>input type "placeholder"
textarea "placeholder"
button primary|secondary "라벨"
checkbox "라벨"
radio "라벨" [checked]
toggle "라벨" [on]
dropdown "라벨"
slider 50 "라벨"
date "날짜 선택"
time "시간 선택"
file "파일 업로드"
color "색상 선택"</code></pre>
    </div>
    <div class="help-section">
        <h4>📊 데이터 표시</h4>
        <pre><code>text "텍스트"
heading 1|2|3 "제목"
paragraph "긴 텍스트"
card "제목" "값" "변화"
stats "라벨" "값" [아이콘]
table "컬럼1" "컬럼2"
chart bar|line|pie "제목"
progress 75 "라벨"
rating 4.5
badge "텍스트" [색상]
tag "태그" [색상]</code></pre>
    </div>
    <div class="help-section">
        <h4>🧭 내비게이션</h4>
        <pre><code>tabs "탭1" "탭2" active:0
breadcrumb "홈" "카테고리" "상품"
stepper 2 "단계1" "단계2" "단계3"
pagination 1 2 3 ... 10
menu "메뉴" [active]
link "링크"</code></pre>
    </div>
    <div class="help-section">
        <h4>📦 컨테이너</h4>
        <pre><code>modal "제목"
form "폼 제목"
accordion "제목1" "제목2"
carousel "슬라이드1" "슬라이드2"
timeline "이벤트1" "이벤트2"</code></pre>
    </div>
    <div class="help-section">
        <h4>🎨 미디어/시각</h4>
        <pre><code>image placeholder
video placeholder
map placeholder
avatar "이름" [add]
icon home|search|user|cart|...
logo "텍스트"
skeleton text|card|image|avatar
calendar</code></pre>
    </div>
    <div class="help-section">
        <h4>💬 피드백</h4>
        <pre><code>alert info|success|warning|error "메시지"
tooltip "도움말"
quote "인용문" "저자"
divider ["텍스트"]</code></pre>
    </div>
    <div class="help-section">
        <h4>🔧 기타</h4>
        <pre><code>list bullet|number|check "항목1" "항목2"
chips "칩1" "칩2" "칩3"
social facebook twitter instagram
search "검색..."
spacer [크기]</code></pre>
    </div>`
};

// 앱 상태
let currentDiagramType = 'flowchart';
let zoomLevel = 100;
let autoRenderTimeout = null;

// DOM 요소
const elements = {};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeEventListeners();
    loadDefaultExample();
    updateLineNumbers();
    render();
});

function initializeElements() {
    elements.codeEditor = document.getElementById('codeEditor');
    elements.lineNumbers = document.getElementById('lineNumbers');
    elements.diagramCanvas = document.getElementById('diagramCanvas');
    elements.previewWrapper = document.getElementById('previewWrapper');
    elements.editorStatus = document.getElementById('editorStatus');
    elements.zoomLevel = document.getElementById('zoomLevel');
    elements.examplesSidebar = document.getElementById('examplesSidebar');
    elements.examplesList = document.getElementById('examplesList');
    elements.syntaxHelp = document.getElementById('syntaxHelp');
    elements.syntaxHelpContent = document.getElementById('syntaxHelpContent');
    elements.resizeHandle = document.getElementById('resizeHandle');
    elements.editorPanel = document.querySelector('.editor-panel');
    elements.mainContent = document.querySelector('.main-content');

    // 렌더러 초기화
    diagramRenderer = new DiagramRenderer('diagramCanvas');
}

function initializeEventListeners() {
    // 탭 전환
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            switchDiagramType(type);
        });
    });

    // 렌더링 버튼
    document.getElementById('renderBtn').addEventListener('click', render);

    // 코드 에디터 이벤트
    elements.codeEditor.addEventListener('input', () => {
        updateLineNumbers();
        scheduleAutoRender();
    });

    elements.codeEditor.addEventListener('scroll', syncScroll);

    elements.codeEditor.addEventListener('keydown', (e) => {
        // Ctrl+Enter로 렌더링
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            render();
        }

        // Tab 들여쓰기
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = elements.codeEditor.selectionStart;
            const end = elements.codeEditor.selectionEnd;
            const value = elements.codeEditor.value;
            elements.codeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
            elements.codeEditor.selectionStart = elements.codeEditor.selectionEnd = start + 4;
        }
    });

    // 줌 컨트롤
    document.getElementById('zoomInBtn').addEventListener('click', () => adjustZoom(10));
    document.getElementById('zoomOutBtn').addEventListener('click', () => adjustZoom(-10));
    document.getElementById('resetZoomBtn').addEventListener('click', () => setZoom(100));

    // 내보내기
    document.getElementById('exportSvgBtn').addEventListener('click', () => diagramRenderer.exportAsSvg());
    document.getElementById('exportPngBtn').addEventListener('click', () => diagramRenderer.exportAsPng());

    // 예제 사이드바
    document.getElementById('toggleExamples').addEventListener('click', toggleExamplesSidebar);
    document.getElementById('closeSidebar').addEventListener('click', toggleExamplesSidebar);

    // 문법 도움말
    document.getElementById('toggleSyntaxHelp').addEventListener('click', toggleSyntaxHelp);
    document.getElementById('closeSyntaxHelp').addEventListener('click', toggleSyntaxHelp);

    // 코드 정리
    document.getElementById('formatBtn').addEventListener('click', formatCode);

    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.examplesSidebar.classList.remove('open');
            elements.syntaxHelp.classList.remove('open');
        }
    });

    // 리사이즈 핸들
    initializeResize();
}

// 리사이즈 기능
function initializeResize() {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    elements.resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = elements.editorPanel.offsetWidth;
        elements.resizeHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const mainWidth = elements.mainContent.offsetWidth;
        const delta = e.clientX - startX;
        let newWidth = startWidth + delta;

        // 최소/최대 너비 제한
        const minWidth = 300;
        const maxWidth = mainWidth * 0.7;

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        elements.editorPanel.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            elements.resizeHandle.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });

    // 터치 지원
    elements.resizeHandle.addEventListener('touchstart', (e) => {
        isResizing = true;
        startX = e.touches[0].clientX;
        startWidth = elements.editorPanel.offsetWidth;
        elements.resizeHandle.classList.add('dragging');
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;

        const mainWidth = elements.mainContent.offsetWidth;
        const delta = e.touches[0].clientX - startX;
        let newWidth = startWidth + delta;

        const minWidth = 300;
        const maxWidth = mainWidth * 0.7;

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        elements.editorPanel.style.width = newWidth + 'px';
    });

    document.addEventListener('touchend', () => {
        if (isResizing) {
            isResizing = false;
            elements.resizeHandle.classList.remove('dragging');
        }
    });
}

function switchDiagramType(type) {
    currentDiagramType = type;

    // 탭 활성화 상태 업데이트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    // 기본 예제 로드
    loadDefaultExample();

    // 문법 도움말 업데이트
    updateSyntaxHelp();

    // 예제 목록 업데이트
    updateExamplesList();

    // 렌더링
    render();
}

function loadDefaultExample() {
    const examples = EXAMPLES[currentDiagramType];
    if (examples && examples.length > 0) {
        elements.codeEditor.value = examples[0].code;
        updateLineNumbers();
    }
}

function updateLineNumbers() {
    const lines = elements.codeEditor.value.split('\n');
    const lineNumbersHtml = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    elements.lineNumbers.innerHTML = lineNumbersHtml;
}

function syncScroll() {
    elements.lineNumbers.scrollTop = elements.codeEditor.scrollTop;
}

function scheduleAutoRender() {
    if (autoRenderTimeout) {
        clearTimeout(autoRenderTimeout);
    }
    autoRenderTimeout = setTimeout(render, 500);
}

function render() {
    const code = elements.codeEditor.value.trim();

    if (!code) {
        elements.editorStatus.textContent = '코드를 입력하세요';
        elements.editorStatus.className = 'status';
        elements.diagramCanvas.innerHTML = '';
        return;
    }

    elements.editorStatus.textContent = '렌더링 중...';
    elements.editorStatus.className = 'status';
    elements.diagramCanvas.classList.add('rendering');

    try {
        const parsed = diagramParser.parse(code);
        diagramRenderer.render(parsed);

        elements.editorStatus.textContent = '렌더링 완료';
        elements.editorStatus.className = 'status success';
    } catch (error) {
        elements.editorStatus.textContent = `오류: ${error.message}`;
        elements.editorStatus.className = 'status error';
        elements.diagramCanvas.innerHTML = `<div class="error-message">${error.message}</div>`;
    }

    elements.diagramCanvas.classList.remove('rendering');
    applyZoom();
}

function adjustZoom(delta) {
    zoomLevel = Math.max(25, Math.min(200, zoomLevel + delta));
    applyZoom();
}

function setZoom(level) {
    zoomLevel = level;
    applyZoom();
}

function applyZoom() {
    elements.zoomLevel.textContent = `${zoomLevel}%`;
    const svg = elements.diagramCanvas.querySelector('svg');
    if (svg) {
        elements.diagramCanvas.style.transform = `scale(${zoomLevel / 100})`;
        elements.diagramCanvas.style.transformOrigin = 'top left';
    }
}

function toggleExamplesSidebar() {
    const isOpen = elements.examplesSidebar.classList.toggle('open');
    if (isOpen) {
        updateExamplesList();
    }
}

function updateExamplesList() {
    const examples = EXAMPLES[currentDiagramType] || [];
    elements.examplesList.innerHTML = examples.map((example, index) => `
        <div class="example-item" data-index="${index}">
            <span class="example-type">${currentDiagramType}</span>
            <h4>${example.name}</h4>
            <p>${example.description}</p>
        </div>
    `).join('');

    // 클릭 이벤트 추가
    elements.examplesList.querySelectorAll('.example-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            loadExample(index);
        });
    });
}

function loadExample(index) {
    const examples = EXAMPLES[currentDiagramType];
    if (examples && examples[index]) {
        elements.codeEditor.value = examples[index].code;
        updateLineNumbers();
        render();
        elements.examplesSidebar.classList.remove('open');
    }
}

function toggleSyntaxHelp() {
    const isOpen = elements.syntaxHelp.classList.toggle('open');
    if (isOpen) {
        updateSyntaxHelp();
    }
}

function updateSyntaxHelp() {
    elements.syntaxHelpContent.innerHTML = SYNTAX_HELP[currentDiagramType] || '';
}

function formatCode() {
    // 기본적인 코드 정리
    let code = elements.codeEditor.value;

    // 연속된 빈 줄을 하나로
    code = code.replace(/\n{3,}/g, '\n\n');

    // 앞뒤 공백 제거
    code = code.trim();

    elements.codeEditor.value = code;
    updateLineNumbers();
    render();
}

// 전역 함수로 노출 (디버깅용)
window.diagramApp = {
    render,
    switchDiagramType,
    loadExample,
    getParser: () => diagramParser,
    getRenderer: () => diagramRenderer
};
