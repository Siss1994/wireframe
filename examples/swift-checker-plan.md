# SWIFT Checker pSEO 사이트 기획

모인비즈플러스의 pSEO 전략 - SWIFT 코드 검색/확인 서비스

## 페이지 구조

```
/swift-code/checker                    → 메인 (검색 + 국가 목록)
/swift-code/checker/{country}          → 국가별 은행 목록
/swift-code/checker/{country}/{code}   → SWIFT 코드 상세
```

---

## 1. 사이트 구조 (Mindmap)

```
mindmap
    root((SWIFT Checker))
        페이지 구조
            [/checker]
                (메인 검색)
                (국가 목록)
                (인기 코드)
            [/{country}]
                (국가 정보)
                (은행 목록)
                (필터/정렬)
            [/{country}/{code}]
                (은행 상세)
                (SWIFT 정보)
                (관련 은행)
        SEO 요소
            [메타 태그]
            [구조화 데이터]
            [내부 링크]
            [사이트맵]
        기능
            (SWIFT 검색)
            (자동완성)
            (복사 기능)
            (공유 기능)
        데이터
            )국가 DB(
            )은행 DB(
            )SWIFT DB(
```

---

## 2. 데이터 모델 (ER Diagram)

```
erDiagram
    COUNTRY ||--o{ BANK : has
    BANK ||--|{ SWIFT_CODE : has
    SWIFT_CODE ||--o{ BRANCH : belongs_to

    COUNTRY {
        string code PK
        string name_ko
        string name_en
        string flag_emoji
        int bank_count
        string slug UK
    }

    BANK {
        int id PK
        string country_code FK
        string name_ko
        string name_en
        string short_name
        string logo_url
        int branch_count
        string slug UK
    }

    SWIFT_CODE {
        string code PK
        int bank_id FK
        string bank_code
        string country_code
        string location_code
        string branch_code
        boolean is_primary
    }

    BRANCH {
        int id PK
        string swift_code FK
        string name
        string address
        string city
        float lat
        float lng
    }
```

---

## 3. 사용자 플로우 (Flowchart)

```
flowchart TD
    A[구글 검색] --> B{검색 의도}
    B -->|국가명 + swift| C[/checker/country]
    B -->|은행명 + swift| D[/checker/country/code]
    B -->|swift code 검색| E[/checker 메인]

    E --> F[검색창 입력]
    F --> G{검색 타입}
    G -->|국가명| C
    G -->|은행명| H[자동완성 결과]
    G -->|SWIFT 코드| I[코드 검증]

    H --> D
    I --> J{유효한 코드?}
    J -->|Yes| D
    J -->|No| K[에러 + 추천]

    C --> L[은행 목록]
    L --> D

    D --> M[SWIFT 상세]
    M --> N[복사/공유]
    M --> O[관련 은행]
    O --> D
```

---

## 4. 페이지별 Wireframe

### 4.1 메인 페이지 (/swift-code/checker)

```
wireframe SWIFT Checker 메인
    header "SWIFT Code Checker - 모인비즈플러스" 0,0,800,60
    nav "홈,SWIFT 검색,국가별,API" 0,60,800,40

    heading "SWIFT 코드 검색" 150,130,500,40
    paragraph "전세계 은행의 SWIFT/BIC 코드를 빠르게 찾아보세요" 150,175,500,30

    search "은행명, 국가, SWIFT 코드 입력..." 100,230,600,50

    heading "인기 국가" 50,320,200,30
    card "🇰🇷 한국" 50,360,170,80
    card "🇺🇸 미국" 230,360,170,80
    card "🇯🇵 일본" 410,360,170,80
    card "🇨🇳 중국" 590,360,170,80

    heading "전체 국가 (A-Z)" 50,480,200,30
    list "호주,오스트리아,벨기에,브라질,캐나다..." 50,520,700,150

    stats "11,000+|등록 은행" 100,700,180,60
    stats "200+|지원 국가" 310,700,180,60
    stats "50,000+|SWIFT 코드" 520,700,180,60

    footer "© 모인비즈플러스 | 이용약관 | 개인정보처리방침" 0,800,800,50
```

### 4.2 국가 페이지 (/swift-code/checker/{country})

```
wireframe 국가별 SWIFT 목록
    header "한국 SWIFT 코드 - SWIFT Checker" 0,0,800,60
    breadcrumb "홈,SWIFT 검색,한국" 20,70,400,25

    heading "🇰🇷 한국 은행 SWIFT 코드" 20,110,500,35
    paragraph "한국의 주요 은행 SWIFT/BIC 코드 목록입니다" 20,150,500,25

    search "은행명으로 검색..." 20,200,500,40
    select "정렬: 이름순" 540,200,150,40

    card "KB국민은행" 20,270,760,90
    text "CZNBKRSE" 40,290,150,25
    badge "PRIMARY" 200,290,80,25
    text "서울특별시 영등포구" 40,320,300,20

    card "신한은행" 20,380,760,90
    text "SHBKKRSE" 40,400,150,25
    badge "PRIMARY" 200,400,80,25
    text "서울특별시 중구" 40,430,300,20

    card "우리은행" 20,490,760,90
    text "HVBKKRSE" 40,510,150,25
    badge "PRIMARY" 200,510,80,25
    text "서울특별시 중구" 40,540,300,20

    pagination "10" 300,620,200,40

    heading "한국 은행 통계" 20,700,300,25
    stats "152|등록 은행" 20,740,150,50
    stats "1,200+|지점" 200,740,150,50

    footer "© 모인비즈플러스" 0,830,800,50
```

### 4.3 상세 페이지 (/swift-code/checker/{country}/{code})

```
wireframe SWIFT 코드 상세
    header "CZNBKRSE - KB국민은행 SWIFT 코드" 0,0,800,60
    breadcrumb "홈,SWIFT 검색,한국,KB국민은행" 20,70,500,25

    card "KB국민은행 SWIFT 코드" 20,110,760,200
    avatar "KB" 40,140,60,60
    heading "KB국민은행" 120,140,300,30
    text "Kookmin Bank" 120,175,200,20

    divider "" 40,210,720,0

    label "SWIFT/BIC 코드" 40,230,150,20
    heading "CZNBKRSE" 40,255,200,35
    button "복사" 250,255,80,35

    table "구분,코드,설명" 40,320,720,120
    text "은행코드: CZNB | 국가: KR | 위치: SE | 지점: XXX" 40,350,700,80

    card "은행 정보" 20,470,370,180
    label "주소" 40,500,100,20
    text "서울특별시 영등포구 여의도동" 40,525,320,20
    label "전화" 40,560,100,20
    text "+82-2-1234-5678" 40,585,200,20
    label "웹사이트" 40,620,100,20
    link "www.kbstar.com" 40,645,200,20

    card "위치" 410,470,370,180
    map "KB국민은행 본점" 420,490,350,150

    heading "관련 은행" 20,680,200,25
    card "신한은행" 20,720,240,70
    card "우리은행" 280,720,240,70
    card "하나은행" 540,720,240,70

    social "" 300,820,200,40
    footer "© 모인비즈플러스" 0,880,800,50
```

---

## 5. SEO 전략 (State Diagram)

```
stateDiagram
    [*] --> 크롤링

    크롤링 --> 인덱싱: 사이트맵 제출
    인덱싱 --> 랭킹: 콘텐츠 최적화

    state 랭킹 {
        [*] --> 키워드매칭
        키워드매칭 --> 클릭률: 메타태그 최적화
        클릭률 --> 체류시간: UX 개선
        체류시간 --> 상위노출
    }

    랭킹 --> 트래픽: 상위 노출
    트래픽 --> 전환: CTA 최적화
    전환 --> [*]
```

---

## 6. API 흐름 (Sequence Diagram)

```
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant C as Cache
    participant D as Database

    U ->> F: 페이지 접속
    F ->> A: GET /api/swift/{country}
    A ->> C: 캐시 확인

    alt 캐시 존재
        C -->> A: 캐시 데이터
    else 캐시 없음
        A ->> D: 쿼리 실행
        D -->> A: 결과
        A ->> C: 캐시 저장 (1시간)
    end

    A -->> F: JSON 응답
    F -->> U: 페이지 렌더링

    U ->> F: SWIFT 코드 검색
    F ->> A: GET /api/swift/search?q=
    A ->> D: LIKE 검색
    D -->> A: 결과
    A -->> F: 자동완성 결과
    F -->> U: 드롭다운 표시
```

---

## 7. 구현 순서 (Gantt)

```
gantt
    title SWIFT Checker 구현 순서
    dateFormat YYYY-MM-DD

    section 1. 기반 (먼저)
    DB 스키마 설계 : crit, 2024-01-01, 2d
    SWIFT 데이터 수집/정제 : crit, 2024-01-01, 3d
    API 인터페이스 정의 : crit, 2024-01-03, 2d

    section 2. 백엔드
    국가/은행 API : active, 2024-01-05, 2d
    SWIFT 검색 API : active, 2024-01-05, 2d
    캐싱 레이어 : 2024-01-07, 1d

    section 3. 프론트엔드
    메인 페이지 : 2024-01-05, 2d
    국가 목록 페이지 : 2024-01-07, 2d
    상세 페이지 : 2024-01-09, 2d
    검색/자동완성 : 2024-01-09, 2d

    section 4. SEO
    메타태그/OG : 2024-01-11, 1d
    구조화 데이터 : 2024-01-11, 1d
    사이트맵 생성 : crit, 2024-01-12, 1d
    robots.txt : 2024-01-12, 1d

    section 5. 배포
    SSG 빌드 설정 : crit, 2024-01-13, 1d
    CDN 설정 : 2024-01-14, 1d
```

**구현 순서 해석:**
1. **먼저 (crit)**: DB 스키마, 데이터 수집, API 정의, 사이트맵, SSG 빌드
2. **핵심 (active)**: 국가/은행 API, SWIFT 검색 API
3. **병렬 가능**: 프론트엔드 페이지들, SEO 요소들

---

## 8. pSEO 키워드 전략

### 타겟 키워드 패턴

| 페이지 | 키워드 패턴 | 예시 |
|--------|------------|------|
| 메인 | swift code checker, bic code 검색 | "swift code 검색", "bic 코드 조회" |
| 국가 | {국가} swift code, {국가} 은행 코드 | "한국 swift code", "미국 은행 swift" |
| 상세 | {은행} swift code, {코드} 은행 | "국민은행 swift", "CZNBKRSE 은행" |

### 메타 태그 템플릿

**메인:**
```html
<title>SWIFT Code Checker - 전세계 은행 SWIFT/BIC 코드 검색</title>
<meta name="description" content="200개국 50,000개 이상의 SWIFT 코드를 무료로 검색하세요. 해외송금에 필요한 BIC 코드를 빠르게 찾아보세요.">
```

**국가:**
```html
<title>{국가} 은행 SWIFT 코드 목록 | SWIFT Checker</title>
<meta name="description" content="{국가}의 {은행수}개 은행 SWIFT/BIC 코드를 확인하세요. {대표은행} 등 주요 은행 코드 제공.">
```

**상세:**
```html
<title>{코드} - {은행명} SWIFT 코드 | {국가}</title>
<meta name="description" content="{은행명}의 SWIFT 코드는 {코드}입니다. {주소}에 위치한 {은행명} 해외송금 코드 정보.">
```

---

## 9. 기술 스택 제안

```
mindmap
    root((SWIFT Checker))
        Frontend
            [Next.js 14]
                (App Router)
                (SSG)
            [Tailwind CSS]
            [TypeScript]
        Backend
            [Next.js API]
            [Prisma ORM]
        Database
            )PostgreSQL(
            )Redis Cache(
        Infrastructure
            [Vercel]
            [Cloudflare CDN]
        SEO
            (next-sitemap)
            (JSON-LD)
```

---

## 10. 예상 페이지 수 (pSEO 스케일)

| 레벨 | 페이지 수 | 예시 |
|------|----------|------|
| 메인 | 1 | /swift-code/checker |
| 국가 | ~200 | /swift-code/checker/kr, /us, /jp... |
| 상세 | ~50,000 | /swift-code/checker/kr/cznbkrse... |
| **합계** | **~50,200** | 프로그래매틱 생성 |

---

이 기획을 기반으로 개발을 진행하면 pSEO를 통해 대량의 롱테일 키워드 트래픽을 확보할 수 있습니다.
