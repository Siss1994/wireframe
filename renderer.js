/**
 * Wireframe Renderer
 * 파싱된 와이어프레임 요소를 HTML로 렌더링
 */

class WireframeRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
    }

    render(data) {
        // 캔버스 초기화
        this.canvas.innerHTML = '';

        // 캔버스 크기 설정
        this.canvas.style.width = data.page.width + 'px';
        this.canvas.style.height = data.page.height + 'px';
        this.canvas.style.position = 'relative';
        this.canvas.style.background = 'white';
        this.canvas.style.border = '1px solid #ddd';

        // 페이지 제목이 있으면 표시
        if (data.page.title) {
            const title = document.createElement('div');
            title.textContent = data.page.title;
            title.style.position = 'absolute';
            title.style.top = '10px';
            title.style.left = '10px';
            title.style.fontSize = '12px';
            title.style.color = '#999';
            this.canvas.appendChild(title);
        }

        // 각 요소 렌더링
        for (const element of data.elements) {
            const rendered = this.renderElement(element);
            if (rendered) {
                this.canvas.appendChild(rendered);
            }
        }
    }

    renderElement(element) {
        const methods = {
            container: this.renderContainer.bind(this),
            button: this.renderButton.bind(this),
            text: this.renderText.bind(this),
            input: this.renderInput.bind(this),
            image: this.renderImage.bind(this),
            navbar: this.renderNavbar.bind(this),
            grid: this.renderGrid.bind(this)
        };

        const renderMethod = methods[element.type];
        if (renderMethod) {
            return renderMethod(element);
        } else {
            console.warn(`Unknown element type: ${element.type}`);
            return null;
        }
    }

    renderContainer(element) {
        const div = document.createElement('div');
        div.className = 'wf-container';
        this.applyStyles(div, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px',
            background: element.props.background || '#ecf0f1'
        });

        if (element.label) {
            const label = document.createElement('div');
            label.textContent = element.label;
            label.style.padding = '10px';
            label.style.fontSize = '14px';
            label.style.fontWeight = 'bold';
            div.appendChild(label);
        }

        return div;
    }

    renderButton(element) {
        const button = document.createElement('div');
        button.className = 'wf-button';
        button.textContent = element.label || 'Button';
        this.applyStyles(button, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px',
            fontSize: '14px'
        });
        return button;
    }

    renderText(element) {
        const text = document.createElement('div');
        text.className = 'wf-text';
        text.textContent = element.label || 'Text';
        this.applyStyles(text, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            fontSize: element.props.size + 'px',
            color: element.props.color || '#333'
        });
        return text;
    }

    renderInput(element) {
        const input = document.createElement('div');
        input.className = 'wf-input';
        input.textContent = element.label || 'Input field...';
        this.applyStyles(input, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return input;
    }

    renderImage(element) {
        const image = document.createElement('div');
        image.className = 'wf-image';

        const icon = document.createElement('div');
        icon.innerHTML = '🖼️';
        icon.style.fontSize = '48px';
        icon.style.marginBottom = '10px';

        const label = document.createElement('div');
        label.textContent = element.label || 'Image';
        label.style.fontSize = '14px';

        image.appendChild(icon);
        image.appendChild(label);

        this.applyStyles(image, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px',
            flexDirection: 'column'
        });
        return image;
    }

    renderNavbar(element) {
        const navbar = document.createElement('div');
        navbar.className = 'wf-navbar';

        const items = Array.isArray(element.props.items)
            ? element.props.items
            : (typeof element.props.items === 'string'
                ? element.props.items.split(',').map(s => s.trim())
                : []);

        for (const item of items) {
            const navItem = document.createElement('div');
            navItem.className = 'wf-navbar-item';
            navItem.textContent = item;
            navbar.appendChild(navItem);
        }

        this.applyStyles(navbar, {
            left: '0px',
            top: '0px',
            width: '100%',
            height: element.props.height + 'px'
        });
        return navbar;
    }

    renderGrid(element) {
        const grid = document.createElement('div');
        grid.className = 'wf-grid';

        const columns = element.props.columns || 3;
        const gap = element.props.gap || 20;
        const items = element.props.items || 6;

        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        grid.style.gap = gap + 'px';

        for (let i = 0; i < items; i++) {
            const gridItem = document.createElement('div');
            gridItem.className = 'wf-grid-item';
            gridItem.textContent = `Item ${i + 1}`;
            gridItem.style.height = '150px';
            grid.appendChild(gridItem);
        }

        this.applyStyles(grid, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width || 'auto'
        });

        return grid;
    }

    applyStyles(element, styles) {
        for (const [key, value] of Object.entries(styles)) {
            element.style[key] = value;
        }
    }

    showError(message) {
        this.canvas.innerHTML = `<div class="error-message">오류: ${message}</div>`;
    }

    exportAsImage() {
        // HTML을 이미지로 변환하는 간단한 구현
        // 실제로는 html2canvas 같은 라이브러리를 사용할 수 있습니다
        alert('이미지 내보내기 기능은 html2canvas 라이브러리를 추가하면 구현할 수 있습니다.\n\n현재는 스크린샷을 사용해주세요.');
    }
}

// 전역 렌더러 인스턴스
let wireframeRenderer;
