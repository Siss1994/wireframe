/**
 * Wireframe Code Builder - Main Application
 */

// 컴포넌트 데이터
const COMPONENTS_DATA = [
    // 기본 컴포넌트
    { name: 'page', icon: '📄', category: '기본', props: 'width, height', example: 'page "제목" {\n  width: 1200\n  height: 800\n}' },
    { name: 'container', icon: '📦', category: '기본', props: 'x, y, width, height, background', example: 'container "컨테이너" {\n  x: 0, y: 0\n  width: 300, height: 200\n}' },
    { name: 'button', icon: '🔘', category: '기본', props: 'x, y, width, height', example: 'button "클릭" {\n  x: 50, y: 50\n  width: 120, height: 40\n}' },
    { name: 'text', icon: '📝', category: '기본', props: 'x, y, size, color', example: 'text "텍스트" {\n  x: 50, y: 100\n  size: 16, color: #333\n}' },
    { name: 'input', icon: '⌨️', category: '기본', props: 'x, y, width, height', example: 'input "입력하세요" {\n  x: 50, y: 150\n  width: 200, height: 40\n}' },
    { name: 'image', icon: '🖼️', category: '기본', props: 'x, y, width, height', example: 'image "이미지" {\n  x: 50, y: 200\n  width: 300, height: 200\n}' },
    { name: 'grid', icon: '⊞', category: '기본', props: 'x, y, columns, gap, items', example: 'grid {\n  x: 50, y: 300\n  columns: 3, gap: 20, items: 6\n}' },

    // 폼 요소
    { name: 'checkbox', icon: '☑️', category: '폼', props: 'x, y, width, height', example: 'checkbox "동의합니다" {\n  x: 50, y: 200\n}' },
    { name: 'radio', icon: '🔘', category: '폼', props: 'x, y, width, height', example: 'radio "옵션 1" {\n  x: 50, y: 230\n}' },
    { name: 'dropdown', icon: '▼', category: '폼', props: 'x, y, width, height', example: 'dropdown "선택" {\n  x: 50, y: 260\n  width: 200\n}' },
    { name: 'textarea', icon: '📄', category: '폼', props: 'x, y, width, height', example: 'textarea "내용" {\n  x: 50, y: 310\n  width: 300, height: 100\n}' },
    { name: 'toggle', icon: '🔀', category: '폼', props: 'x, y, width, height', example: 'toggle "알림" {\n  x: 50, y: 420\n  width: 50, height: 25\n}' },
    { name: 'slider', icon: '🎚️', category: '폼', props: 'x, y, width, height', example: 'slider {\n  x: 50, y: 460\n  width: 200\n}' },

    // 레이아웃
    { name: 'card', icon: '🗃️', category: '레이아웃', props: 'x, y, width, height', example: 'card "카드" {\n  x: 50, y: 500\n  width: 300, height: 200\n}' },
    { name: 'sidebar', icon: '📑', category: '레이아웃', props: 'x, y, width, height', example: 'sidebar "메뉴" {\n  x: 0, y: 80\n  width: 250, height: 600\n}' },
    { name: 'header', icon: '🎯', category: '레이아웃', props: 'x, y, width, height, background', example: 'header "헤더" {\n  x: 0, y: 0\n  width: 1200, height: 80\n}' },
    { name: 'footer', icon: '⬛', category: '레이아웃', props: 'x, y, width, height, background', example: 'footer "© 2024" {\n  x: 0, y: 920\n  width: 1200, height: 80\n}' },
    { name: 'modal', icon: '🪟', category: '레이아웃', props: 'x, y, width, height', example: 'modal "경고" {\n  x: 300, y: 150\n  width: 600, height: 400\n}' },

    // 네비게이션
    { name: 'navbar', icon: '🧭', category: '네비게이션', props: 'height, items', example: 'navbar {\n  height: 60\n  items: ["홈", "소개", "서비스"]\n}' },
    { name: 'tabs', icon: '📑', category: '네비게이션', props: 'x, y, width, height, items', example: 'tabs {\n  x: 50, y: 100\n  width: 600\n  items: ["탭1", "탭2", "탭3"]\n}' },
    { name: 'breadcrumb', icon: '🗺️', category: '네비게이션', props: 'x, y, width, height, items', example: 'breadcrumb {\n  x: 50, y: 150\n  items: ["홈", "카테고리", "현재"]\n}' },
    { name: 'pagination', icon: '📄', category: '네비게이션', props: 'x, y, width, height, pages', example: 'pagination {\n  x: 50, y: 200\n  pages: 5\n}' },
    { name: 'menu', icon: '☰', category: '네비게이션', props: 'x, y, width, height, items', example: 'menu {\n  x: 50, y: 250\n  width: 200\n  items: ["항목1", "항목2"]\n}' },

    // 데이터
    { name: 'table', icon: '📊', category: '데이터', props: 'x, y, width, height, rows, columns', example: 'table {\n  x: 50, y: 500\n  width: 600, height: 300\n  rows: 5, columns: 4\n}' },
    { name: 'list', icon: '📋', category: '데이터', props: 'x, y, width, height, items', example: 'list {\n  x: 50, y: 850\n  items: ["항목1", "항목2", "항목3"]\n}' },

    // 피드백
    { name: 'alert', icon: 'ℹ️', category: '피드백', props: 'x, y, width, height, type', example: 'alert "알림" {\n  x: 50, y: 1000\n  width: 400\n  type: info\n}' },
    { name: 'badge', icon: '🏷️', category: '피드백', props: 'x, y, width, height', example: 'badge "5" {\n  x: 150, y: 50\n  width: 30, height: 25\n}' },
    { name: 'progress', icon: '📈', category: '피드백', props: 'x, y, width, height, value', example: 'progress {\n  x: 50, y: 1080\n  width: 300\n  value: 75\n}' },

    // 미디어
    { name: 'video', icon: '🎥', category: '미디어', props: 'x, y, width, height', example: 'video "비디오" {\n  x: 50, y: 1150\n  width: 640, height: 360\n}' },

    // 아이콘 - UI
    { name: 'icon-home', icon: '🏠', category: '아이콘-UI', props: 'x, y, size, iconType', example: 'icon "home" {\n  x: 50, y: 50\n  size: 32\n}' },
    { name: 'icon-search', icon: '🔍', category: '아이콘-UI', props: 'x, y, size, iconType', example: 'icon "search" {\n  x: 100, y: 50\n  size: 32\n}' },
    { name: 'icon-settings', icon: '⚙️', category: '아이콘-UI', props: 'x, y, size, iconType', example: 'icon "settings" {\n  x: 150, y: 50\n  size: 32\n}' },
    { name: 'icon-menu', icon: '☰', category: '아이콘-UI', props: 'x, y, size, iconType', example: 'icon "menu" {\n  x: 200, y: 50\n  size: 32\n}' },
    { name: 'icon-edit', icon: '✏️', category: '아이콘-UI', props: 'x, y, size, iconType', example: 'icon "edit" {\n  x: 250, y: 50\n  size: 32\n}' },
    { name: 'icon-delete', icon: '🗑️', category: '아이콘-UI', props: 'x, y, size, iconType', example: 'icon "delete" {\n  x: 300, y: 50\n  size: 32\n}' },

    // 아이콘 - 소셜
    { name: 'icon-twitter', icon: '🐦', category: '아이콘-소셜', props: 'x, y, size, iconType', example: 'icon "twitter" {\n  x: 50, y: 100\n  size: 32\n}' },
    { name: 'icon-instagram', icon: '📷', category: '아이콘-소셜', props: 'x, y, size, iconType', example: 'icon "instagram" {\n  x: 100, y: 100\n  size: 32\n}' },
    { name: 'icon-github', icon: '😺', category: '아이콘-소셜', props: 'x, y, size, iconType', example: 'icon "github" {\n  x: 150, y: 100\n  size: 32\n}' },

    // 아이콘 - 비즈니스
    { name: 'icon-user', icon: '👤', category: '아이콘-비즈니스', props: 'x, y, size, iconType', example: 'icon "user" {\n  x: 50, y: 150\n  size: 32\n}' },
    { name: 'icon-calendar', icon: '📅', category: '아이콘-비즈니스', props: 'x, y, size, iconType', example: 'icon "calendar" {\n  x: 100, y: 150\n  size: 32\n}' },
    { name: 'icon-mail', icon: '✉️', category: '아이콘-비즈니스', props: 'x, y, size, iconType', example: 'icon "mail" {\n  x: 150, y: 150\n  size: 32\n}' },
    { name: 'icon-briefcase', icon: '💼', category: '아이콘-비즈니스', props: 'x, y, size, iconType', example: 'icon "briefcase" {\n  x: 200, y: 150\n  size: 32\n}' },

    // 아이콘 - 상태
    { name: 'icon-success', icon: '✓', category: '아이콘-상태', props: 'x, y, size, iconType', example: 'icon "success" {\n  x: 50, y: 200\n  size: 32\n}' },
    { name: 'icon-error', icon: '✗', category: '아이콘-상태', props: 'x, y, size, iconType', example: 'icon "error" {\n  x: 100, y: 200\n  size: 32\n}' },
    { name: 'icon-warning', icon: '⚠️', category: '아이콘-상태', props: 'x, y, size, iconType', example: 'icon "warning" {\n  x: 150, y: 200\n  size: 32\n}' },
    { name: 'icon-star', icon: '⭐', category: '아이콘-상태', props: 'x, y, size, iconType', example: 'icon "star" {\n  x: 200, y: 200\n  size: 32\n}' },
    { name: 'icon-heart', icon: '❤️', category: '아이콘-상태', props: 'x, y, size, iconType', example: 'icon "heart" {\n  x: 250, y: 200\n  size: 32\n}' },

    // 차트 타입들
    { name: 'chart-bar', icon: '📊', category: '차트', props: 'x, y, width, height, type', example: 'chart "막대 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: bar\n}' },
    { name: 'chart-line', icon: '📈', category: '차트', props: 'x, y, width, height, type', example: 'chart "라인 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: line\n}' },
    { name: 'chart-pie', icon: '🥧', category: '차트', props: 'x, y, width, height, type', example: 'chart "파이 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: pie\n}' },
    { name: 'chart-donut', icon: '🍩', category: '차트', props: 'x, y, width, height, type', example: 'chart "도넛 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: donut\n}' },
    { name: 'chart-area', icon: '📉', category: '차트', props: 'x, y, width, height, type', example: 'chart "영역 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: area\n}' },
    { name: 'chart-scatter', icon: '⚬', category: '차트', props: 'x, y, width, height, type', example: 'chart "산점도" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: scatter\n}' },
    { name: 'chart-radar', icon: '🕸️', category: '차트', props: 'x, y, width, height, type', example: 'chart "레이더 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: radar\n}' },
    { name: 'chart-gauge', icon: '⏲️', category: '차트', props: 'x, y, width, height, type', example: 'chart "게이지 차트" {\n  x: 50, y: 300\n  width: 400, height: 300\n  type: gauge\n}' },

    // 지도
    { name: 'map', icon: '🗺️', category: '지도', props: 'x, y, width, height', example: 'map "위치" {\n  x: 500, y: 1600\n  width: 600, height: 400\n}' },

    // 기타
    { name: 'divider', icon: '➖', category: '기타', props: 'x, y, width, height', example: 'divider {\n  x: 50, y: 2050\n  width: 600, height: 2\n}' },
    { name: 'avatar', icon: '👤', category: '기타', props: 'x, y, size', example: 'avatar "👨" {\n  x: 50, y: 2100\n  size: 48\n}' },
    { name: 'tooltip', icon: '💬', category: '기타', props: 'x, y, width, height', example: 'tooltip "도움말" {\n  x: 150, y: 2100\n  width: 150\n}' }
];

// 예제 와이어프레임 코드
const EXAMPLE_CODE = `// 대시보드 예제 - 다양한 컴포넌트 데모
page "관리자 대시보드" {
  width: 1400
  height: 2850
}

// 상단 헤더
header "Dashboard" {
  x: 0
  y: 0
  width: 1400
  height: 70
}

avatar "👨" {
  x: 1300
  y: 18
  size: 34
}

// 사이드바
sidebar "메뉴" {
  x: 0
  y: 70
  width: 250
  height: 1730
}

menu {
  x: 10
  y: 90
  width: 230
  height: 250
  items: ["대시보드", "사용자", "설정", "분석", "리포트"]
}

// 브레드크럼
breadcrumb {
  x: 270
  y: 85
  items: ["홈", "대시보드", "개요"]
}

// 알림
alert "새로운 업데이트가 있습니다!" {
  x: 270
  y: 120
  width: 1100
  type: info
}

// 통계 카드들
card "총 사용자" {
  x: 270
  y: 200
  width: 250
  height: 120
}

card "신규 가입" {
  x: 540
  y: 200
  width: 250
  height: 120
}

card "활성 세션" {
  x: 810
  y: 200
  width: 250
  height: 120
}

card "수익" {
  x: 1080
  y: 200
  width: 290
  height: 120
}

// 차트
chart "월별 매출" {
  x: 270
  y: 340
  width: 630
  height: 300
  type: bar
}

chart "사용자 성장" {
  x: 920
  y: 340
  width: 450
  height: 300
  type: line
}

// 프로그레스 바
text "서버 사용량" {
  x: 270
  y: 670
  size: 16
  color: #2c3e50
}

progress {
  x: 270
  y: 700
  width: 500
  value: 75
}

text "저장공간" {
  x: 800
  y: 670
  size: 16
  color: #2c3e50
}

progress {
  x: 800
  y: 700
  width: 500
  value: 45
}

// 탭
tabs {
  x: 270
  y: 750
  width: 1100
  items: ["전체", "활성", "대기중", "완료"]
}

// 테이블
table {
  x: 270
  y: 800
  width: 1100
  height: 400
  rows: 8
  columns: 5
}

// 페이지네이션
pagination {
  x: 270
  y: 1220
  pages: 5
}

// 폼 요소 섹션
container "설정" {
  x: 270
  y: 1280
  width: 530
  height: 480
  background: #ffffff
}

text "알림 설정" {
  x: 290
  y: 1300
  size: 18
  color: #2c3e50
}

checkbox "이메일 알림 받기" {
  x: 290
  y: 1340
}

checkbox "SMS 알림 받기" {
  x: 290
  y: 1380
}

radio "옵션 A" {
  x: 290
  y: 1430
}

radio "옵션 B" {
  x: 290
  y: 1460
}

dropdown "카테고리 선택" {
  x: 290
  y: 1510
  width: 300
}

input "이메일 주소" {
  x: 290
  y: 1570
  width: 300
}

textarea "피드백" {
  x: 290
  y: 1630
  width: 480
  height: 100
}

// 미디어 및 기타
video "튜토리얼 비디오" {
  x: 820
  y: 1280
  width: 550
  height: 310
}

map "위치" {
  x: 820
  y: 1610
  width: 550
  height: 150
}

// 아이콘 모음 (UI 아이콘)
text "아이콘 - UI" {
  x: 270
  y: 1800
  size: 18
  color: #2c3e50
}

icon "home" {
  x: 270
  y: 1830
  size: 36
}

icon "search" {
  x: 320
  y: 1830
  size: 36
}

icon "settings" {
  x: 370
  y: 1830
  size: 36
}

icon "edit" {
  x: 420
  y: 1830
  size: 36
}

icon "delete" {
  x: 470
  y: 1830
  size: 36
}

// 아이콘 - 비즈니스
text "아이콘 - 비즈니스" {
  x: 550
  y: 1800
  size: 18
  color: #2c3e50
}

icon "user" {
  x: 550
  y: 1830
  size: 36
}

icon "calendar" {
  x: 600
  y: 1830
  size: 36
}

icon "mail" {
  x: 650
  y: 1830
  size: 36
}

icon "briefcase" {
  x: 700
  y: 1830
  size: 36
}

// 아이콘 - 상태
text "아이콘 - 상태" {
  x: 800
  y: 1800
  size: 18
  color: #2c3e50
}

icon "success" {
  x: 800
  y: 1830
  size: 36
}

icon "warning" {
  x: 850
  y: 1830
  size: 36
}

icon "heart" {
  x: 900
  y: 1830
  size: 36
}

icon "star" {
  x: 950
  y: 1830
  size: 36
}

// 다양한 차트 타입
text "차트 타입 비교" {
  x: 270
  y: 1900
  size: 20
  color: #2c3e50
}

chart "라인 차트" {
  x: 270
  y: 1930
  width: 350
  height: 250
  type: line
}

chart "파이 차트" {
  x: 640
  y: 1930
  width: 350
  height: 250
  type: pie
}

chart "도넛 차트" {
  x: 1010
  y: 1930
  width: 350
  height: 250
  type: donut
}

chart "영역 차트" {
  x: 270
  y: 2200
  width: 350
  height: 250
  type: area
}

chart "산점도" {
  x: 640
  y: 2200
  width: 350
  height: 250
  type: scatter
}

chart "레이더 차트" {
  x: 1010
  y: 2200
  width: 350
  height: 250
  type: radar
}

chart "게이지 차트" {
  x: 270
  y: 2470
  width: 350
  height: 250
  type: gauge
}

// 하단 푸터
footer "© 2024 WireFrame Builder" {
  x: 0
  y: 2750
  width: 1400
  height: 60
}`;

// 컴포넌트 갤러리 렌더링 함수
function renderComponentGallery() {
    const galleryItems = document.getElementById('galleryItems');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');

    // 컴포넌트 카드 생성
    COMPONENTS_DATA.forEach(component => {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.dataset.component = component.name;

        card.innerHTML = `
            <div class="component-icon">${component.icon}</div>
            <div class="component-name">${component.name}</div>
            <div class="component-category">${component.category}</div>
            <div class="component-tooltip">
                <div class="tooltip-title">${component.name}</div>
                <div class="tooltip-props">속성: ${component.props}</div>
                <div class="tooltip-props" style="margin-top: 5px; font-style: italic;">드래그 또는 클릭하여 추가</div>
            </div>
        `;

        // 드래그 가능하도록 설정
        card.setAttribute('draggable', 'true');
        card.style.cursor = 'grab';

        // 드래그 시작
        card.addEventListener('dragstart', (e) => {
            card.style.cursor = 'grabbing';
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('component', JSON.stringify(component));
            card.style.opacity = '0.5';
        });

        // 드래그 종료
        card.addEventListener('dragend', () => {
            card.style.cursor = 'grab';
            card.style.opacity = '1';
        });

        // 클릭 이벤트: 에디터에 예제 코드 삽입
        card.addEventListener('click', () => {
            const codeEditor = document.getElementById('codeEditor');
            const cursorPos = codeEditor.selectionStart;
            const textBefore = codeEditor.value.substring(0, cursorPos);
            const textAfter = codeEditor.value.substring(cursorPos);

            // 예제 코드 삽입
            codeEditor.value = textBefore + '\n' + component.example + '\n' + textAfter;

            // 커서 위치 조정
            const newCursorPos = cursorPos + component.example.length + 2;
            codeEditor.setSelectionRange(newCursorPos, newCursorPos);
            codeEditor.focus();

            // 카드 활성화 표시
            document.querySelectorAll('.component-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            setTimeout(() => card.classList.remove('active'), 1000);
        });

        galleryItems.appendChild(card);
    });

    // 좌우 스크롤 버튼
    galleryPrev.addEventListener('click', () => {
        galleryItems.scrollBy({ left: -300, behavior: 'smooth' });
    });

    galleryNext.addEventListener('click', () => {
        galleryItems.scrollBy({ left: 300, behavior: 'smooth' });
    });

    // 스크롤 상태에 따라 버튼 비활성화
    function updateNavButtons() {
        const scrollLeft = galleryItems.scrollLeft;
        const scrollWidth = galleryItems.scrollWidth;
        const clientWidth = galleryItems.clientWidth;

        galleryPrev.disabled = scrollLeft <= 0;
        galleryNext.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
    }

    galleryItems.addEventListener('scroll', updateNavButtons);
    updateNavButtons();
}

// 코드 업데이트 헬퍼 함수
function updateCodeWithPosition(element, index, newX, newY) {
    const codeEditor = document.getElementById('codeEditor');
    const codeEditorModal = document.getElementById('codeEditorModal');
    const lines = codeEditor.value.split('\n');

    // 해당 요소의 코드 블록 찾기
    let blockStart = -1;
    let blockEnd = -1;
    let blockCount = 0;
    let inBlock = false;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 블록 시작 감지
        if (!inBlock && line && !line.startsWith('//')) {
            if (line.includes('{')) {
                if (blockCount === index) {
                    blockStart = i;
                    inBlock = true;
                    braceDepth = 1;
                } else {
                    blockCount++;
                }
            }
        } else if (inBlock) {
            if (line.includes('{')) braceDepth++;
            if (line.includes('}')) {
                braceDepth--;
                if (braceDepth === 0) {
                    blockEnd = i;
                    break;
                }
            }
        }
    }

    if (blockStart === -1 || blockEnd === -1) {
        console.error('Could not find element block in code');
        return;
    }

    // x, y 값 업데이트
    let xUpdated = false;
    let yUpdated = false;

    for (let i = blockStart + 1; i < blockEnd; i++) {
        const line = lines[i];
        if (line.includes('x:')) {
            lines[i] = line.replace(/x:\s*\d+/, `x: ${newX}`);
            xUpdated = true;
        } else if (line.includes('y:')) {
            lines[i] = line.replace(/y:\s*\d+/, `y: ${newY}`);
            yUpdated = true;
        }
    }

    // x, y가 없으면 추가
    if (!xUpdated || !yUpdated) {
        const indent = '  ';
        const positionLine = `${indent}x: ${newX}, y: ${newY}`;
        lines.splice(blockStart + 1, 0, positionLine);
    }

    const newCode = lines.join('\n');
    codeEditor.value = newCode;
    codeEditorModal.value = newCode;
}

function addCodeToEditor(code) {
    const codeEditor = document.getElementById('codeEditor');
    const codeEditorModal = document.getElementById('codeEditorModal');

    // 코드 끝에 추가 (footer 전에)
    const lines = codeEditor.value.split('\n');
    let insertIndex = lines.length;

    // footer를 찾아서 그 앞에 삽입
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('footer')) {
            // footer 블록 시작 찾기
            insertIndex = i;
            // 빈 줄과 주석 건너뛰기
            while (insertIndex > 0 && (lines[insertIndex - 1].trim() === '' || lines[insertIndex - 1].trim().startsWith('//'))) {
                insertIndex--;
            }
            break;
        }
    }

    lines.splice(insertIndex, 0, '', code);
    const newCode = lines.join('\n');
    codeEditor.value = newCode;
    codeEditorModal.value = newCode;

    // 자동 렌더링
    try {
        const parsedData = wireframeParser.parse(newCode);
        wireframeRenderer.render(parsedData);
    } catch (error) {
        console.error('Failed to render after adding component:', error);
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    wireframeRenderer = new WireframeRenderer('canvas');

    // 컴포넌트 갤러리 렌더링
    renderComponentGallery();

    const codeEditor = document.getElementById('codeEditor');
    const codeEditorModal = document.getElementById('codeEditorModal');
    const renderBtn = document.getElementById('renderBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    const exportBtn = document.getElementById('exportBtn');

    // 코드 업데이트 콜백 설정
    wireframeRenderer.onCodeUpdate = (action, data) => {
        if (action === 'move') {
            updateCodeWithPosition(data.element, data.index, data.newX, data.newY);
        } else if (action === 'add') {
            addCodeToEditor(data);
        }
    };

    // 뷰 모드 토글 요소들
    const viewCodeBtn = document.getElementById('viewCodeBtn');
    const viewBothBtn = document.getElementById('viewBothBtn');
    const viewPreviewBtn = document.getElementById('viewPreviewBtn');
    const codeModal = document.getElementById('codeModal');
    const toggleCodeModal = document.getElementById('toggleCodeModal');
    const codeModalContent = document.getElementById('codeModalContent');

    // 모달 버튼들
    const renderBtnModal = document.getElementById('renderBtnModal');
    const clearBtnModal = document.getElementById('clearBtnModal');
    const exampleBtnModal = document.getElementById('exampleBtnModal');

    // 뷰 모드 토글 함수
    function setViewMode(mode) {
        // body 클래스 초기화
        document.body.classList.remove('view-code', 'view-both', 'view-preview');

        // 새로운 모드 적용
        document.body.classList.add(`view-${mode}`);

        // 버튼 활성화 상태 업데이트
        [viewCodeBtn, viewBothBtn, viewPreviewBtn].forEach(btn => btn.classList.remove('active'));

        if (mode === 'code') {
            viewCodeBtn.classList.add('active');
        } else if (mode === 'both') {
            viewBothBtn.classList.add('active');
            // 둘다보기 모드에서는 코드 동기화
            syncCodeToModal();
        } else if (mode === 'preview') {
            viewPreviewBtn.classList.add('active');
        }
    }

    // 코드 동기화 함수 (main -> modal)
    function syncCodeToModal() {
        codeEditorModal.value = codeEditor.value;
    }

    // 코드 동기화 함수 (modal -> main)
    function syncCodeToMain() {
        codeEditor.value = codeEditorModal.value;
    }

    // 렌더링 함수 (공통)
    function renderCode(code) {
        if (!code.trim()) {
            wireframeRenderer.showError('코드를 입력해주세요.');
            return;
        }

        try {
            const parsedData = wireframeParser.parse(code);
            wireframeRenderer.render(parsedData);
        } catch (error) {
            wireframeRenderer.showError(error.message);
            console.error('Parsing error:', error);
        }
    }

    // 뷰 모드 버튼 이벤트
    viewCodeBtn.addEventListener('click', () => setViewMode('code'));
    viewBothBtn.addEventListener('click', () => setViewMode('both'));
    viewPreviewBtn.addEventListener('click', () => setViewMode('preview'));

    // 코드 모달 토글 버튼
    toggleCodeModal.addEventListener('click', () => {
        codeModalContent.classList.toggle('collapsed');
        toggleCodeModal.textContent = codeModalContent.classList.contains('collapsed') ? '▲' : '▼';
    });

    // 렌더링 버튼 (메인)
    renderBtn.addEventListener('click', () => {
        renderCode(codeEditor.value);
    });

    // 렌더링 버튼 (모달)
    renderBtnModal.addEventListener('click', () => {
        syncCodeToMain(); // 모달 코드를 메인으로 동기화
        renderCode(codeEditorModal.value);
    });

    // 초기화 버튼 (메인)
    clearBtn.addEventListener('click', () => {
        if (confirm('작성한 코드를 모두 지우시겠습니까?')) {
            codeEditor.value = '';
            codeEditorModal.value = '';
            wireframeRenderer.canvas.innerHTML = '';
        }
    });

    // 초기화 버튼 (모달)
    clearBtnModal.addEventListener('click', () => {
        if (confirm('작성한 코드를 모두 지우시겠습니까?')) {
            codeEditor.value = '';
            codeEditorModal.value = '';
            wireframeRenderer.canvas.innerHTML = '';
        }
    });

    // 예제 보기 버튼 (메인)
    exampleBtn.addEventListener('click', () => {
        codeEditor.value = EXAMPLE_CODE;
        codeEditorModal.value = EXAMPLE_CODE;
        // 자동으로 렌더링
        const parsedData = wireframeParser.parse(EXAMPLE_CODE);
        wireframeRenderer.render(parsedData);
    });

    // 예제 보기 버튼 (모달)
    exampleBtnModal.addEventListener('click', () => {
        codeEditor.value = EXAMPLE_CODE;
        codeEditorModal.value = EXAMPLE_CODE;
        // 자동으로 렌더링
        const parsedData = wireframeParser.parse(EXAMPLE_CODE);
        wireframeRenderer.render(parsedData);
    });

    // 이미지 저장 버튼
    exportBtn.addEventListener('click', () => {
        wireframeRenderer.exportAsImage();
    });

    // Ctrl+Enter로 렌더링 (메인 에디터)
    codeEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            renderBtn.click();
        }
    });

    // Ctrl+Enter로 렌더링 (모달 에디터)
    codeEditorModal.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            renderBtnModal.click();
        }
    });

    // 컴포넌트 갤러리 클릭 시 현재 뷰 모드에 따라 코드 삽입
    const originalGalleryItems = document.getElementById('galleryItems');
    originalGalleryItems.addEventListener('click', (e) => {
        const card = e.target.closest('.component-card');
        if (card) {
            const viewMode = document.body.className.match(/view-(\w+)/)?.[1];
            if (viewMode === 'both') {
                // 둘다보기 모드에서는 모달 에디터에도 동일하게 삽입
                syncCodeToModal();
            }
        }
    });

    // 페이지 로드 시 예제 표시
    codeEditor.value = EXAMPLE_CODE;
    codeEditorModal.value = EXAMPLE_CODE;
    const parsedData = wireframeParser.parse(EXAMPLE_CODE);
    wireframeRenderer.render(parsedData);

    // 초기 뷰 모드 설정 (둘다보기)
    setViewMode('both');
});
