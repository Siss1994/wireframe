/**
 * Wireframe Code Parser
 * 와이어프레임 DSL을 파싱하여 객체로 변환
 */

class WireframeParser {
    constructor() {
        this.elements = [];
        this.pageConfig = {
            width: 1200,
            height: 800
        };
    }

    parse(code) {
        this.elements = [];
        this.pageConfig = {
            width: 1200,
            height: 800
        };

        // 주석 제거
        code = code.replace(/\/\/.*/g, '');

        // 각 블록을 추출
        const blocks = this.extractBlocks(code);

        for (const block of blocks) {
            this.parseBlock(block);
        }

        return {
            page: this.pageConfig,
            elements: this.elements
        };
    }

    extractBlocks(code) {
        const blocks = [];
        const lines = code.split('\n');
        let currentBlock = null;
        let braceCount = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // 블록 시작 감지
            if (line.includes('{')) {
                if (!currentBlock) {
                    const match = line.match(/^(\w+)(?:\s+"([^"]*)")?/);
                    if (match) {
                        currentBlock = {
                            type: match[1],
                            label: match[2] || '',
                            properties: []
                        };
                    }
                }
                braceCount += (line.match(/{/g) || []).length;
            }

            // 속성 추출
            if (currentBlock && !line.includes('{') && !line.includes('}')) {
                const propMatch = line.match(/(\w+):\s*(.+)/);
                if (propMatch) {
                    currentBlock.properties.push({
                        key: propMatch[1],
                        value: propMatch[2].replace(/["\[\]]/g, '').trim()
                    });
                }
            }

            // 블록 종료 감지
            if (line.includes('}')) {
                braceCount -= (line.match(/}/g) || []).length;
                if (braceCount === 0 && currentBlock) {
                    blocks.push(currentBlock);
                    currentBlock = null;
                }
            }
        }

        return blocks;
    }

    parseBlock(block) {
        const element = {
            type: block.type,
            label: block.label,
            props: {}
        };

        // 속성 파싱
        for (const prop of block.properties) {
            const value = prop.value;

            // 숫자 변환
            if (!isNaN(value)) {
                element.props[prop.key] = parseFloat(value);
            }
            // 배열 처리
            else if (value.includes(',')) {
                element.props[prop.key] = value.split(',').map(v => v.trim());
            }
            // 문자열
            else {
                element.props[prop.key] = value;
            }
        }

        // 기본값 설정
        this.setDefaults(element);

        // 페이지 설정인 경우
        if (element.type === 'page') {
            if (element.props.width) this.pageConfig.width = element.props.width;
            if (element.props.height) this.pageConfig.height = element.props.height;
            this.pageConfig.title = element.label;
        } else {
            this.elements.push(element);
        }
    }

    setDefaults(element) {
        const defaults = {
            // 기존 컴포넌트
            container: { x: 0, y: 0, width: 300, height: 200, background: '#ecf0f1' },
            button: { x: 0, y: 0, width: 120, height: 40 },
            text: { x: 0, y: 0, size: 16, color: '#333' },
            input: { x: 0, y: 0, width: 200, height: 40 },
            image: { x: 0, y: 0, width: 300, height: 200 },
            navbar: { height: 60, items: [] },
            grid: { x: 0, y: 0, columns: 3, gap: 20, items: 6 },

            // 폼 요소
            checkbox: { x: 0, y: 0, width: 20, height: 20 },
            radio: { x: 0, y: 0, width: 20, height: 20 },
            dropdown: { x: 0, y: 0, width: 200, height: 40 },
            textarea: { x: 0, y: 0, width: 300, height: 100 },
            toggle: { x: 0, y: 0, width: 50, height: 25 },
            slider: { x: 0, y: 0, width: 200, height: 30 },

            // 레이아웃 요소
            card: { x: 0, y: 0, width: 300, height: 200 },
            sidebar: { x: 0, y: 0, width: 250, height: 600 },
            header: { x: 0, y: 0, width: 1200, height: 80, background: '#34495e' },
            footer: { x: 0, y: 0, width: 1200, height: 80, background: '#2c3e50' },
            modal: { x: 300, y: 150, width: 600, height: 400 },

            // 네비게이션
            tabs: { x: 0, y: 0, width: 600, height: 40, items: [] },
            breadcrumb: { x: 0, y: 0, width: 600, height: 30, items: [] },
            pagination: { x: 0, y: 0, width: 400, height: 40, pages: 5 },
            menu: { x: 0, y: 0, width: 200, height: 300, items: [] },

            // 데이터 표시
            table: { x: 0, y: 0, width: 600, height: 300, rows: 5, columns: 4 },
            list: { x: 0, y: 0, width: 300, height: 200, items: [] },

            // 피드백 요소
            alert: { x: 0, y: 0, width: 400, height: 60, type: 'info' },
            badge: { x: 0, y: 0, width: 60, height: 25 },
            progress: { x: 0, y: 0, width: 300, height: 20, value: 50 },

            // 미디어
            video: { x: 0, y: 0, width: 640, height: 360 },
            icon: { x: 0, y: 0, size: 24 },

            // 차트/맵
            chart: { x: 0, y: 0, width: 400, height: 300, type: 'bar' },
            map: { x: 0, y: 0, width: 600, height: 400 },

            // 기타
            divider: { x: 0, y: 0, width: 600, height: 2 },
            avatar: { x: 0, y: 0, size: 48 },
            tooltip: { x: 0, y: 0, width: 150, height: 40 }
        };

        if (defaults[element.type]) {
            element.props = { ...defaults[element.type], ...element.props };
        }
    }

    validate(code) {
        try {
            this.parse(code);
            return { valid: true, message: '코드가 올바릅니다.' };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }
}

// 전역 파서 인스턴스
const wireframeParser = new WireframeParser();
