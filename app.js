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

// 와이어프레임 컴포넌트 레퍼런스 데이터
const COMPONENT_REFERENCE = {
    categories: [
        { id: 'structure', name: '📱 구조', icon: '📱' },
        { id: 'form', name: '📝 폼', icon: '📝' },
        { id: 'data', name: '📊 데이터', icon: '📊' },
        { id: 'navigation', name: '🧭 내비게이션', icon: '🧭' },
        { id: 'container', name: '📦 컨테이너', icon: '📦' },
        { id: 'media', name: '🎨 미디어', icon: '🎨' },
        { id: 'feedback', name: '💬 피드백', icon: '💬' },
        { id: 'other', name: '🔧 기타', icon: '🔧' }
    ],
    components: {
        structure: [
            {
                name: 'wireframe',
                icon: '📄',
                description: '와이어프레임의 시작을 선언합니다. 페이지 이름을 지정할 수 있습니다.',
                syntax: 'wireframe [페이지명]',
                params: [
                    { name: '페이지명', desc: '페이지 제목 (선택)', optional: true }
                ],
                examples: ['wireframe 로그인 페이지', 'wireframe 대시보드', 'wireframe']
            },
            {
                name: 'device',
                icon: '📱',
                description: '디바이스 크기를 설정합니다. mobile(375x667), tablet(768x1024), desktop(1200x800).',
                syntax: 'device mobile|tablet|desktop',
                params: [
                    { name: 'mobile', desc: '375x667 크기의 모바일 화면' },
                    { name: 'tablet', desc: '768x1024 크기의 태블릿 화면' },
                    { name: 'desktop', desc: '1200x800 크기의 데스크탑 화면' }
                ],
                examples: ['device mobile', 'device tablet', 'device desktop']
            },
            {
                name: 'header',
                icon: '🔝',
                description: '페이지 상단 헤더 영역입니다. logo, nav, avatar, icon 등을 포함할 수 있습니다.',
                syntax: 'header\\n    [내용]\\nend',
                params: [
                    { name: '내용', desc: 'logo, nav, avatar, icon, search 등' }
                ],
                examples: ['header\\n    logo "MyApp"\\n    nav "홈" "설정"\\nend']
            },
            {
                name: 'footer',
                icon: '🔚',
                description: '페이지 하단 푸터 영역입니다.',
                syntax: 'footer\\n    [내용]\\nend',
                params: [
                    { name: '내용', desc: 'link, text, button 등' }
                ],
                examples: ['footer\\n    link "이용약관"\\n    text "© 2024"\\nend']
            },
            {
                name: 'sidebar',
                icon: '📑',
                description: '사이드바 영역입니다. 주로 메뉴 항목들을 포함합니다.',
                syntax: 'sidebar\\n    [내용]\\nend',
                params: [
                    { name: '내용', desc: 'menu, divider, link 등' }
                ],
                examples: ['sidebar\\n    menu "홈" active\\n    menu "설정"\\nend']
            },
            {
                name: 'section',
                icon: '📋',
                description: '콘텐츠 섹션을 정의합니다. 섹션명을 헤더로 표시합니다.',
                syntax: 'section [섹션명]\\n    [내용]\\nend',
                params: [
                    { name: '섹션명', desc: '섹션 제목' }
                ],
                examples: ['section 로그인 폼\\n    input email "이메일"\\n    button primary "로그인"\\nend']
            },
            {
                name: 'statusbar',
                icon: '📶',
                description: '모바일 상태바를 표시합니다 (시간, 배터리 등).',
                syntax: 'statusbar',
                params: [],
                examples: ['statusbar']
            },
            {
                name: 'bottomnav',
                icon: '⬇️',
                description: '모바일 하단 내비게이션 바입니다.',
                syntax: 'bottomnav\\n    icon [아이콘명] [active]\\nend',
                params: [
                    { name: 'icon', desc: '아이콘 항목' },
                    { name: 'active', desc: '활성 상태 표시 (선택)', optional: true }
                ],
                examples: ['bottomnav\\n    icon home active\\n    icon search\\n    icon user\\nend']
            }
        ],
        form: [
            {
                name: 'input',
                icon: '⌨️',
                description: '텍스트 입력 필드입니다. 다양한 타입을 지원합니다.',
                syntax: 'input [type] "[placeholder]"',
                params: [
                    { name: 'type', desc: 'text, email, password, number 등' },
                    { name: 'placeholder', desc: '힌트 텍스트' }
                ],
                examples: ['input text "이름을 입력하세요"', 'input email "이메일 주소"', 'input password "비밀번호"']
            },
            {
                name: 'textarea',
                icon: '📝',
                description: '여러 줄 텍스트 입력 영역입니다.',
                syntax: 'textarea "[placeholder]"',
                params: [
                    { name: 'placeholder', desc: '힌트 텍스트' }
                ],
                examples: ['textarea "내용을 입력하세요..."', 'textarea "메모"']
            },
            {
                name: 'button',
                icon: '🔘',
                description: '버튼입니다. primary(강조)와 secondary(보조) 스타일을 지원합니다.',
                syntax: 'button primary|secondary "[라벨]"',
                params: [
                    { name: 'primary', desc: '강조 버튼 (파란색 배경)' },
                    { name: 'secondary', desc: '보조 버튼 (회색 배경)' },
                    { name: '라벨', desc: '버튼 텍스트' }
                ],
                examples: ['button primary "저장"', 'button secondary "취소"']
            },
            {
                name: 'checkbox',
                icon: '☑️',
                description: '체크박스입니다.',
                syntax: 'checkbox "[라벨]"',
                params: [
                    { name: '라벨', desc: '체크박스 옆에 표시될 텍스트' }
                ],
                examples: ['checkbox "이용약관에 동의합니다"', 'checkbox "자동 로그인"']
            },
            {
                name: 'radio',
                icon: '🔘',
                description: '라디오 버튼입니다. checked 옵션으로 선택 상태를 표시합니다.',
                syntax: 'radio "[라벨]" [checked]',
                params: [
                    { name: '라벨', desc: '라디오 버튼 옆에 표시될 텍스트' },
                    { name: 'checked', desc: '선택된 상태로 표시 (선택)', optional: true }
                ],
                examples: ['radio "옵션 A"', 'radio "옵션 B" checked']
            },
            {
                name: 'toggle',
                icon: '🔀',
                description: '토글 스위치입니다. on 옵션으로 켜진 상태를 표시합니다.',
                syntax: 'toggle "[라벨]" [on]',
                params: [
                    { name: '라벨', desc: '토글 옆에 표시될 텍스트' },
                    { name: 'on', desc: '켜진 상태로 표시 (선택)', optional: true }
                ],
                examples: ['toggle "알림 허용"', 'toggle "다크 모드" on']
            },
            {
                name: 'dropdown',
                icon: '🔽',
                description: '드롭다운 선택 메뉴입니다.',
                syntax: 'dropdown "[라벨]"',
                params: [
                    { name: '라벨', desc: '드롭다운에 표시될 텍스트' }
                ],
                examples: ['dropdown "카테고리 선택"', 'dropdown "정렬 방식"']
            },
            {
                name: 'slider',
                icon: '🎚️',
                description: '슬라이더 컨트롤입니다. 0-100 사이의 값을 지정합니다.',
                syntax: 'slider [값] "[라벨]"',
                params: [
                    { name: '값', desc: '0-100 사이의 숫자' },
                    { name: '라벨', desc: '슬라이더 설명 (선택)', optional: true }
                ],
                examples: ['slider 50', 'slider 75 "볼륨"', 'slider 30 "밝기"']
            },
            {
                name: 'date',
                icon: '📅',
                description: '날짜 선택 입력 필드입니다.',
                syntax: 'date "[라벨]"',
                params: [
                    { name: '라벨', desc: '입력 필드에 표시될 텍스트' }
                ],
                examples: ['date "생년월일"', 'date "예약 날짜"']
            },
            {
                name: 'time',
                icon: '🕐',
                description: '시간 선택 입력 필드입니다.',
                syntax: 'time "[라벨]"',
                params: [
                    { name: '라벨', desc: '입력 필드에 표시될 텍스트' }
                ],
                examples: ['time "시작 시간"', 'time "예약 시간"']
            },
            {
                name: 'file',
                icon: '📁',
                description: '파일 업로드 영역입니다. 점선 테두리로 드래그 앤 드롭을 암시합니다.',
                syntax: 'file "[라벨]"',
                params: [
                    { name: '라벨', desc: '업로드 영역에 표시될 안내 텍스트' }
                ],
                examples: ['file "파일을 드래그하거나 클릭하세요"', 'file "이미지 업로드"']
            },
            {
                name: 'color',
                icon: '🎨',
                description: '색상 선택 입력 필드입니다.',
                syntax: 'color "[라벨]"',
                params: [
                    { name: '라벨', desc: '입력 필드에 표시될 텍스트' }
                ],
                examples: ['color "테마 색상"', 'color "배경색 선택"']
            }
        ],
        data: [
            {
                name: 'text',
                icon: '📝',
                description: '일반 텍스트를 표시합니다.',
                syntax: 'text "[내용]"',
                params: [
                    { name: '내용', desc: '표시할 텍스트' }
                ],
                examples: ['text "안녕하세요"', 'text "© 2024 Company"']
            },
            {
                name: 'heading',
                icon: '🔤',
                description: '제목 텍스트입니다. 레벨(1-4)에 따라 크기가 달라집니다.',
                syntax: 'heading [1-4] "[텍스트]"',
                params: [
                    { name: '레벨', desc: '1(가장 큼) ~ 4(가장 작음)' },
                    { name: '텍스트', desc: '제목 내용' }
                ],
                examples: ['heading 1 "큰 제목"', 'heading 2 "중간 제목"', 'heading 3 "작은 제목"']
            },
            {
                name: 'paragraph',
                icon: '📄',
                description: '문단 텍스트입니다. 회색 색상으로 표시됩니다.',
                syntax: 'paragraph "[텍스트]"',
                params: [
                    { name: '텍스트', desc: '문단 내용' }
                ],
                examples: ['paragraph "이것은 설명 텍스트입니다."']
            },
            {
                name: 'card',
                icon: '🃏',
                description: '통계 카드입니다. 제목, 값, 변화율을 표시합니다.',
                syntax: 'card "[제목]" "[값]" "[변화]"',
                params: [
                    { name: '제목', desc: '카드 상단 라벨' },
                    { name: '값', desc: '주요 수치' },
                    { name: '변화', desc: '변화율 (선택, +는 초록, -는 빨강)', optional: true }
                ],
                examples: ['card "총 매출" "₩1,234,567" "+12%"', 'card "방문자" "1,234" "-5%"']
            },
            {
                name: 'stats',
                icon: '📈',
                description: '통계 표시 컴포넌트입니다. 아이콘과 함께 라벨과 값을 표시합니다.',
                syntax: 'stats "[라벨]" "[값]" [아이콘]',
                params: [
                    { name: '라벨', desc: '통계 항목명' },
                    { name: '값', desc: '통계 수치' },
                    { name: '아이콘', desc: '아이콘 이름 (선택)', optional: true }
                ],
                examples: ['stats "총 사용자" "12,345"', 'stats "매출" "₩1,234,567" cart']
            },
            {
                name: 'table',
                icon: '📊',
                description: '테이블입니다. 컬럼명을 지정하면 헤더와 예시 행이 표시됩니다.',
                syntax: 'table "[컬럼1]" "[컬럼2]" ...',
                params: [
                    { name: '컬럼', desc: '테이블 헤더 컬럼명들' }
                ],
                examples: ['table "이름" "이메일" "가입일"', 'table "상품" "가격" "수량"']
            },
            {
                name: 'chart',
                icon: '📉',
                description: '차트 플레이스홀더입니다. bar, line, pie 타입을 지원합니다.',
                syntax: 'chart bar|line|pie "[제목]"',
                params: [
                    { name: 'bar', desc: '막대 차트' },
                    { name: 'line', desc: '선 차트' },
                    { name: 'pie', desc: '파이 차트' },
                    { name: '제목', desc: '차트 제목' }
                ],
                examples: ['chart bar "월별 매출"', 'chart line "일별 방문자"', 'chart pie "카테고리 분포"']
            },
            {
                name: 'progress',
                icon: '📶',
                description: '진행률 표시 바입니다.',
                syntax: 'progress [값] "[라벨]"',
                params: [
                    { name: '값', desc: '0-100 사이의 퍼센트 값' },
                    { name: '라벨', desc: '진행률 설명 (선택)', optional: true }
                ],
                examples: ['progress 75', 'progress 45 "다운로드 진행률"']
            },
            {
                name: 'rating',
                icon: '⭐',
                description: '별점 표시입니다.',
                syntax: 'rating [값]',
                params: [
                    { name: '값', desc: '0-5 사이의 숫자 (소수점 가능)' }
                ],
                examples: ['rating 4.5', 'rating 3', 'rating 5']
            },
            {
                name: 'badge',
                icon: '🏷️',
                description: '뱃지/라벨입니다. 색상을 지정할 수 있습니다.',
                syntax: 'badge "[텍스트]" [색상]',
                params: [
                    { name: '텍스트', desc: '뱃지에 표시될 텍스트' },
                    { name: '색상', desc: 'red, green, blue, yellow, gray (선택)', optional: true }
                ],
                examples: ['badge "New"', 'badge "Sale" red', 'badge "인기" green']
            },
            {
                name: 'tag',
                icon: '🔖',
                description: '태그입니다. 뱃지보다 각진 모양입니다.',
                syntax: 'tag "[텍스트]" [색상]',
                params: [
                    { name: '텍스트', desc: '태그에 표시될 텍스트' },
                    { name: '색상', desc: 'red, green, blue, yellow, gray, purple (선택)', optional: true }
                ],
                examples: ['tag "기술"', 'tag "긴급" red', 'tag "완료" green']
            },
            {
                name: 'product',
                icon: '🛍️',
                description: '상품 카드입니다. 이미지, 이름, 가격, 별점을 포함합니다.',
                syntax: 'product "[이름]" "[가격]" star [별점]',
                params: [
                    { name: '이름', desc: '상품명' },
                    { name: '가격', desc: '가격 표시' },
                    { name: 'star', desc: '별점 표시 키워드 (선택)', optional: true },
                    { name: '별점', desc: '0-5 사이의 숫자', optional: true }
                ],
                examples: ['product "상품명" "₩29,000"', 'product "상품명" "₩29,000" star 4.5']
            }
        ],
        navigation: [
            {
                name: 'tabs',
                icon: '📑',
                description: '탭 내비게이션입니다. active:인덱스로 활성 탭을 지정합니다.',
                syntax: 'tabs "[탭1]" "[탭2]" ... active:[인덱스]',
                params: [
                    { name: '탭', desc: '탭 이름들' },
                    { name: 'active:', desc: '활성 탭 인덱스 (0부터 시작, 선택)', optional: true }
                ],
                examples: ['tabs "전체" "인기" "최신"', 'tabs "홈" "검색" "설정" active:1']
            },
            {
                name: 'breadcrumb',
                icon: '🔗',
                description: '브레드크럼 내비게이션입니다. 현재 위치 경로를 표시합니다.',
                syntax: 'breadcrumb "[항목1]" "[항목2]" ...',
                params: [
                    { name: '항목', desc: '경로 항목들 (마지막 항목이 현재 위치)' }
                ],
                examples: ['breadcrumb "홈" "카테고리" "상품"', 'breadcrumb "설정" "계정"']
            },
            {
                name: 'stepper',
                icon: '👣',
                description: '단계 표시기입니다. 현재 진행 단계를 보여줍니다.',
                syntax: 'stepper [현재단계] "[단계1]" "[단계2]" ...',
                params: [
                    { name: '현재단계', desc: '현재 활성 단계 번호 (1부터 시작)' },
                    { name: '단계', desc: '각 단계 이름들' }
                ],
                examples: ['stepper 2 "정보입력" "결제" "완료"', 'stepper 1 "장바구니" "배송" "결제"']
            },
            {
                name: 'pagination',
                icon: '📃',
                description: '페이지네이션입니다. 페이지 번호들을 표시합니다.',
                syntax: 'pagination [페이지번호들]',
                params: [
                    { name: '페이지번호', desc: '숫자 또는 ... (생략 표시)' }
                ],
                examples: ['pagination 1 2 3 4 5', 'pagination 1 2 3 ... 10']
            },
            {
                name: 'menu',
                icon: '📋',
                description: '사이드바 메뉴 항목입니다. active로 선택 상태를 표시합니다.',
                syntax: 'menu "[라벨]" [active]',
                params: [
                    { name: '라벨', desc: '메뉴 항목 텍스트' },
                    { name: 'active', desc: '선택된 상태로 표시 (선택)', optional: true }
                ],
                examples: ['menu "대시보드" active', 'menu "설정"']
            },
            {
                name: 'nav',
                icon: '🧭',
                description: '헤더용 내비게이션 메뉴입니다. 여러 항목을 나열합니다.',
                syntax: 'nav "[항목1]" "[항목2]" ...',
                params: [
                    { name: '항목', desc: '내비게이션 메뉴 항목들' }
                ],
                examples: ['nav "홈" "서비스" "문의"', 'nav "대시보드" "설정"']
            },
            {
                name: 'link',
                icon: '🔗',
                description: '링크 텍스트입니다. 파란색으로 표시됩니다.',
                syntax: 'link "[텍스트]"',
                params: [
                    { name: '텍스트', desc: '링크 텍스트' }
                ],
                examples: ['link "자세히 보기"', 'link "비밀번호 찾기"']
            }
        ],
        container: [
            {
                name: 'modal',
                icon: '🪟',
                description: '모달 다이얼로그 플레이스홀더입니다.',
                syntax: 'modal "[제목]"',
                params: [
                    { name: '제목', desc: '모달 헤더 제목' }
                ],
                examples: ['modal "확인"', 'modal "새 항목 추가"']
            },
            {
                name: 'form',
                icon: '📋',
                description: '폼 컨테이너 플레이스홀더입니다. 제목과 필드 영역을 표시합니다.',
                syntax: 'form "[제목]"',
                params: [
                    { name: '제목', desc: '폼 제목' }
                ],
                examples: ['form "회원가입"', 'form "문의하기"']
            },
            {
                name: 'accordion',
                icon: '🪗',
                description: '아코디언 접기/펼치기 컴포넌트입니다.',
                syntax: 'accordion "[제목1]" "[제목2]" ...',
                params: [
                    { name: '제목', desc: '각 아코디언 항목 제목들' }
                ],
                examples: ['accordion "FAQ 1" "FAQ 2" "FAQ 3"', 'accordion "배송 안내" "반품 안내"']
            },
            {
                name: 'carousel',
                icon: '🎠',
                description: '캐러셀/슬라이더 컴포넌트입니다.',
                syntax: 'carousel "[슬라이드1]" "[슬라이드2]" ...',
                params: [
                    { name: '슬라이드', desc: '각 슬라이드 내용/이름' }
                ],
                examples: ['carousel "배너1" "배너2" "배너3"', 'carousel "이미지1" "이미지2"']
            },
            {
                name: 'timeline',
                icon: '📅',
                description: '타임라인 컴포넌트입니다. 순차적인 이벤트를 표시합니다.',
                syntax: 'timeline "[이벤트1]" "[이벤트2]" ...',
                params: [
                    { name: '이벤트', desc: '타임라인 항목들' }
                ],
                examples: ['timeline "주문접수" "배송준비" "배송중" "배송완료"']
            },
            {
                name: 'post',
                icon: '📰',
                description: '소셜 미디어 포스트 컨테이너입니다. avatar, image, icons, text를 포함합니다.',
                syntax: 'post\\n    avatar "[이름]"\\n    image placeholder\\n    icons [아이콘들]\\n    text "[내용]"\\nend',
                params: [
                    { name: 'avatar', desc: '작성자 프로필' },
                    { name: 'image', desc: '포스트 이미지' },
                    { name: 'icons', desc: '좋아요, 댓글 등 아이콘들' },
                    { name: 'text', desc: '포스트 내용' }
                ],
                examples: ['post\\n    avatar "user1"\\n    image placeholder\\n    icons heart comment share\\n    text "내용..."\\nend']
            }
        ],
        media: [
            {
                name: 'image',
                icon: '🖼️',
                description: '이미지 플레이스홀더입니다.',
                syntax: 'image placeholder',
                params: [
                    { name: 'placeholder', desc: '플레이스홀더 표시 키워드' }
                ],
                examples: ['image placeholder']
            },
            {
                name: 'video',
                icon: '🎬',
                description: '비디오 플레이스홀더입니다. 재생 버튼이 표시됩니다.',
                syntax: 'video placeholder',
                params: [
                    { name: 'placeholder', desc: '플레이스홀더 표시 키워드' }
                ],
                examples: ['video placeholder']
            },
            {
                name: 'map',
                icon: '🗺️',
                description: '지도 플레이스홀더입니다.',
                syntax: 'map placeholder',
                params: [
                    { name: 'placeholder', desc: '플레이스홀더 표시 키워드' }
                ],
                examples: ['map placeholder']
            },
            {
                name: 'avatar',
                icon: '👤',
                description: '사용자 아바타입니다. add 옵션으로 추가 버튼 스타일을 적용합니다.',
                syntax: 'avatar "[이름]" [add]',
                params: [
                    { name: '이름', desc: '사용자 이름 (아래에 표시)' },
                    { name: 'add', desc: '+ 버튼 스타일 적용 (선택)', optional: true }
                ],
                examples: ['avatar "홍길동"', 'avatar "내 스토리" add']
            },
            {
                name: 'icon',
                icon: '🔣',
                description: '단일 아이콘입니다. active로 활성 상태를 표시합니다.',
                syntax: 'icon [이름] [active]',
                params: [
                    { name: '이름', desc: 'home, search, heart, user, cart, settings, bell, message, add, menu, close, check' },
                    { name: 'active', desc: '활성 상태 (파란색) (선택)', optional: true }
                ],
                examples: ['icon home', 'icon search active', 'icon cart']
            },
            {
                name: 'icons',
                icon: '🔣',
                description: '여러 아이콘을 가로로 나열합니다.',
                syntax: 'icons [이름1] [이름2] ...',
                params: [
                    { name: '이름', desc: '아이콘 이름들' }
                ],
                examples: ['icons heart comment share bookmark', 'icons home search user']
            },
            {
                name: 'logo',
                icon: '🏷️',
                description: '로고 텍스트입니다. 헤더에 주로 사용됩니다.',
                syntax: 'logo "[텍스트]"',
                params: [
                    { name: '텍스트', desc: '로고 텍스트' }
                ],
                examples: ['logo "MyApp"', 'logo "Company"']
            },
            {
                name: 'skeleton',
                icon: '💀',
                description: '로딩 스켈레톤 UI입니다.',
                syntax: 'skeleton text|card|image|avatar [개수]',
                params: [
                    { name: 'text', desc: '텍스트 스켈레톤' },
                    { name: 'card', desc: '카드 스켈레톤' },
                    { name: 'image', desc: '이미지 스켈레톤' },
                    { name: 'avatar', desc: '아바타 스켈레톤' },
                    { name: '개수', desc: '반복 횟수 (선택)', optional: true }
                ],
                examples: ['skeleton text 3', 'skeleton card', 'skeleton avatar 2']
            },
            {
                name: 'calendar',
                icon: '📆',
                description: '캘린더 컴포넌트입니다.',
                syntax: 'calendar',
                params: [],
                examples: ['calendar']
            }
        ],
        feedback: [
            {
                name: 'alert',
                icon: '⚠️',
                description: '알림/경고 메시지입니다. 타입에 따라 색상이 달라집니다.',
                syntax: 'alert info|success|warning|error "[메시지]"',
                params: [
                    { name: 'info', desc: '정보 알림 (파란색)' },
                    { name: 'success', desc: '성공 알림 (초록색)' },
                    { name: 'warning', desc: '경고 알림 (주황색)' },
                    { name: 'error', desc: '오류 알림 (빨간색)' },
                    { name: '메시지', desc: '알림 내용' }
                ],
                examples: ['alert info "정보입니다"', 'alert success "저장되었습니다"', 'alert error "오류 발생"']
            },
            {
                name: 'tooltip',
                icon: '💬',
                description: '툴팁입니다. 작은 말풍선 형태로 표시됩니다.',
                syntax: 'tooltip "[텍스트]"',
                params: [
                    { name: '텍스트', desc: '툴팁 내용' }
                ],
                examples: ['tooltip "도움말 텍스트"', 'tooltip "클릭하세요"']
            },
            {
                name: 'quote',
                icon: '💭',
                description: '인용문입니다. 왼쪽에 파란 바가 표시됩니다.',
                syntax: 'quote "[인용문]" "[저자]"',
                params: [
                    { name: '인용문', desc: '인용할 텍스트' },
                    { name: '저자', desc: '인용 출처/저자 (선택)', optional: true }
                ],
                examples: ['quote "좋은 디자인은 눈에 띄지 않는다"', 'quote "인용문" "저자"']
            },
            {
                name: 'divider',
                icon: '➖',
                description: '구분선입니다. 텍스트를 포함할 수 있습니다.',
                syntax: 'divider ["텍스트"]',
                params: [
                    { name: '텍스트', desc: '구분선 중앙에 표시할 텍스트 (선택)', optional: true }
                ],
                examples: ['divider', 'divider "또는"', 'divider "OR"']
            }
        ],
        other: [
            {
                name: 'list',
                icon: '📝',
                description: '리스트입니다. bullet(점), number(번호), check(체크) 스타일을 지원합니다.',
                syntax: 'list bullet|number|check "[항목1]" "[항목2]" ...',
                params: [
                    { name: 'bullet', desc: '글머리 기호 (•)' },
                    { name: 'number', desc: '번호 매기기 (1. 2. 3.)' },
                    { name: 'check', desc: '체크 표시 (☑)' },
                    { name: '항목', desc: '리스트 항목들' }
                ],
                examples: ['list bullet "항목 1" "항목 2"', 'list number "첫째" "둘째"', 'list check "완료" "진행중"']
            },
            {
                name: 'chips',
                icon: '🏷️',
                description: '칩/태그 그룹입니다. 여러 칩을 가로로 나열합니다.',
                syntax: 'chips "[칩1]" "[칩2]" ...',
                params: [
                    { name: '칩', desc: '칩 텍스트들' }
                ],
                examples: ['chips "React" "Vue" "Angular"', 'chips "태그1" "태그2"']
            },
            {
                name: 'social',
                icon: '🌐',
                description: '소셜 미디어 아이콘 그룹입니다.',
                syntax: 'social [네트워크1] [네트워크2] ...',
                params: [
                    { name: '네트워크', desc: 'facebook, twitter, instagram, linkedin, youtube, github' }
                ],
                examples: ['social facebook twitter instagram', 'social github linkedin']
            },
            {
                name: 'search',
                icon: '🔍',
                description: '검색 입력 필드입니다. 돋보기 아이콘이 포함됩니다.',
                syntax: 'search "[placeholder]"',
                params: [
                    { name: 'placeholder', desc: '검색창 힌트 텍스트' }
                ],
                examples: ['search "검색어를 입력하세요"', 'search "상품 검색..."']
            },
            {
                name: 'spacer',
                icon: '↕️',
                description: '빈 공간을 추가합니다.',
                syntax: 'spacer [크기]',
                params: [
                    { name: '크기', desc: '픽셀 단위 높이 (기본값: 20)', optional: true }
                ],
                examples: ['spacer', 'spacer 40', 'spacer 10']
            }
        ]
    }
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
    elements.componentReferenceOverlay = document.getElementById('componentReferenceOverlay');
    elements.referenceNav = document.getElementById('referenceNav');
    elements.referenceContent = document.getElementById('referenceContent');

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
            elements.componentReferenceOverlay.classList.remove('active');
        }
    });

    // 리사이즈 핸들
    initializeResize();

    // 컴포넌트 레퍼런스
    document.getElementById('toggleReference').addEventListener('click', openComponentReference);
    document.getElementById('closeReference').addEventListener('click', closeComponentReference);
    elements.componentReferenceOverlay.addEventListener('click', (e) => {
        if (e.target === elements.componentReferenceOverlay) {
            closeComponentReference();
        }
    });
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

// 컴포넌트 레퍼런스 기능
let currentReferenceCategory = 'structure';

function openComponentReference() {
    elements.componentReferenceOverlay.classList.add('active');
    renderReferenceNav();
    renderReferenceContent(currentReferenceCategory);
}

function closeComponentReference() {
    elements.componentReferenceOverlay.classList.remove('active');
}

function renderReferenceNav() {
    elements.referenceNav.innerHTML = COMPONENT_REFERENCE.categories.map(cat => `
        <button class="reference-nav-btn ${cat.id === currentReferenceCategory ? 'active' : ''}"
                data-category="${cat.id}">
            ${cat.name}
        </button>
    `).join('');

    elements.referenceNav.querySelectorAll('.reference-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentReferenceCategory = btn.dataset.category;
            renderReferenceNav();
            renderReferenceContent(currentReferenceCategory);
        });
    });
}

function renderReferenceContent(categoryId) {
    const components = COMPONENT_REFERENCE.components[categoryId] || [];

    elements.referenceContent.innerHTML = components.map(comp => `
        <div class="component-card">
            <h3>
                <span class="component-icon">${comp.icon}</span>
                ${comp.name}
            </h3>
            <p class="description">${comp.description}</p>
            <div class="syntax-box">
                <code>${comp.syntax.replace(/\\n/g, '\n')}</code>
            </div>
            ${comp.params.length > 0 ? `
                <div class="params">
                    <div class="params-title">파라미터</div>
                    ${comp.params.map(p => `
                        <div class="param-item">
                            <span class="param-name">${p.name}</span>
                            <span class="param-desc">${p.desc}</span>
                            ${p.optional ? '<span class="param-optional">(선택)</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="examples">
                <div class="examples-title">사용 예시</div>
                ${comp.examples.map(ex => `
                    <div class="example-code">${ex.replace(/\\n/g, '\n')}</div>
                `).join('')}
            </div>
        </div>
    `).join('');
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
