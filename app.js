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
    { name: 'icon', icon: '⭐', category: '미디어', props: 'x, y, size', example: 'icon "⭐" {\n  x: 50, y: 1550\n  size: 32\n}' },

    // 차트/맵
    { name: 'chart', icon: '📊', category: '차트', props: 'x, y, width, height, type', example: 'chart "매출" {\n  x: 50, y: 1600\n  width: 400, height: 300\n  type: bar\n}' },
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
  height: 1800
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

// 하단 푸터
footer "© 2024 WireFrame Builder" {
  x: 0
  y: 1800
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
                <div class="tooltip-props" style="margin-top: 5px; font-style: italic;">클릭하여 예제 삽입</div>
            </div>
        `;

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

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    wireframeRenderer = new WireframeRenderer('canvas');

    // 컴포넌트 갤러리 렌더링
    renderComponentGallery();

    const codeEditor = document.getElementById('codeEditor');
    const renderBtn = document.getElementById('renderBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    const exportBtn = document.getElementById('exportBtn');

    // 렌더링 버튼
    renderBtn.addEventListener('click', () => {
        const code = codeEditor.value;

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
    });

    // 초기화 버튼
    clearBtn.addEventListener('click', () => {
        if (confirm('작성한 코드를 모두 지우시겠습니까?')) {
            codeEditor.value = '';
            wireframeRenderer.canvas.innerHTML = '';
        }
    });

    // 예제 보기 버튼
    exampleBtn.addEventListener('click', () => {
        codeEditor.value = EXAMPLE_CODE;
        // 자동으로 렌더링
        const parsedData = wireframeParser.parse(EXAMPLE_CODE);
        wireframeRenderer.render(parsedData);
    });

    // 이미지 저장 버튼
    exportBtn.addEventListener('click', () => {
        wireframeRenderer.exportAsImage();
    });

    // Ctrl+Enter로 렌더링
    codeEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            renderBtn.click();
        }
    });

    // 페이지 로드 시 예제 표시
    codeEditor.value = EXAMPLE_CODE;
    const parsedData = wireframeParser.parse(EXAMPLE_CODE);
    wireframeRenderer.render(parsedData);
});
