/**
 * Wireframe Code Builder - Main Application
 */

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
