/**
 * Wireframe Code Builder - Main Application
 */

// 예제 와이어프레임 코드
const EXAMPLE_CODE = `// 랜딩 페이지 예제
page "랜딩 페이지" {
  width: 1200
  height: 1000
}

// 네비게이션 바
navbar {
  height: 60
  items: ["홈", "기능", "가격", "고객사례", "문의하기"]
}

// 헤더 섹션
container "Hero Section" {
  x: 0
  y: 60
  width: 1200
  height: 400
  background: #3498db
}

text "서비스 타이틀" {
  x: 100
  y: 150
  size: 48
  color: #ffffff
}

text "서브 타이틀 설명" {
  x: 100
  y: 220
  size: 20
  color: #ecf0f1
}

button "시작하기" {
  x: 100
  y: 280
  width: 150
  height: 50
}

button "더 알아보기" {
  x: 270
  y: 280
  width: 150
  height: 50
}

// 이미지 영역
image "Hero 이미지" {
  x: 700
  y: 120
  width: 400
  height: 300
}

// 기능 섹션
container "Features" {
  x: 0
  y: 480
  width: 1200
  height: 80
  background: #ecf0f1
}

text "주요 기능" {
  x: 500
  y: 510
  size: 32
  color: #2c3e50
}

// 그리드 레이아웃
grid {
  x: 50
  y: 600
  width: 1100
  columns: 3
  gap: 30
  items: 6
}

// 푸터
container "Footer" {
  x: 0
  y: 920
  width: 1200
  height: 80
  background: #2c3e50
}

text "© 2024 Your Company" {
  x: 500
  y: 950
  size: 14
  color: #ffffff
}`;

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    wireframeRenderer = new WireframeRenderer('canvas');

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
