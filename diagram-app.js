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
