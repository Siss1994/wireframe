/**
 * Wireframe Renderer
 * 파싱된 와이어프레임 요소를 HTML로 렌더링
 */

class WireframeRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.currentData = null; // 현재 렌더링된 데이터 저장
        this.draggedElement = null; // 드래그 중인 요소
        this.onCodeUpdate = null; // 코드 업데이트 콜백
        this.guidelines = []; // 가이드라인 배열
        this.snapThreshold = 8; // 스냅 임계값 (픽셀)
        this.gridSize = 10; // 그리드 크기
        this.setupCanvasDragDrop();
    }

    // 캔버스 드래그 앤 드롭 설정
    setupCanvasDragDrop() {
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            // 드래그 중 실시간 위치 추적
            if (this.draggedElement) {
                this.updateDragPreview(e);
            }
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.clearGuidelines();

            const wrapper = this.canvas.querySelector('.wireframe-wrapper');
            if (!wrapper) return;

            const rect = wrapper.getBoundingClientRect();
            const x = Math.round(e.clientX - rect.left);
            const y = Math.round(e.clientY - rect.top);

            // 컴포넌트 갤러리에서 드래그한 경우
            const componentData = e.dataTransfer.getData('component');
            if (componentData) {
                try {
                    const component = JSON.parse(componentData);
                    this.addNewComponent(component, x, y);
                } catch (err) {
                    console.error('Failed to add component:', err);
                }
            }
        });
    }

    // 드래그 프리뷰 업데이트 (실시간 스냅 및 가이드라인)
    updateDragPreview(e) {
        if (!this.draggedElement) return;

        const wrapper = this.canvas.querySelector('.wireframe-wrapper');
        const rect = wrapper.getBoundingClientRect();

        let newX = Math.round(e.clientX - rect.left - this.draggedElement.offsetX);
        let newY = Math.round(e.clientY - rect.top - this.draggedElement.offsetY);

        // 스냅 적용
        const snapped = this.applySnap(newX, newY, this.draggedElement.index);
        newX = snapped.x;
        newY = snapped.y;

        // 가이드라인 표시
        this.showGuidelines(snapped.guidelines);

        // 컨테이너 감지 및 하이라이트
        this.highlightContainer(e.clientX, e.clientY);
    }

    // 컨테이너 하이라이트
    highlightContainer(clientX, clientY) {
        // 기존 하이라이트 제거
        const prevHighlighted = this.canvas.querySelectorAll('.container-highlight');
        prevHighlighted.forEach(el => el.classList.remove('container-highlight'));

        // 컨테이너 타입 정의
        const containerTypes = ['wf-container', 'wf-card', 'wf-sidebar', 'wf-modal', 'wf-header', 'wf-footer'];

        // 드래그 중인 요소를 제외한 컨테이너 찾기
        const containers = Array.from(this.canvas.querySelectorAll(
            containerTypes.map(type => `.${type}`).join(', ')
        )).filter(el => {
            // 드래그 중인 요소는 제외
            if (this.draggedElement && el === this.draggedElement.domElement) {
                return false;
            }
            return true;
        });

        // 마우스 위치의 컨테이너 찾기
        for (const container of containers) {
            const rect = container.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                container.classList.add('container-highlight');
                break;
            }
        }
    }

    // 스냅 로직 적용
    applySnap(x, y, currentIndex) {
        let snappedX = x;
        let snappedY = y;
        const guidelines = [];

        // 그리드 스냅
        const gridSnappedX = Math.round(x / this.gridSize) * this.gridSize;
        const gridSnappedY = Math.round(y / this.gridSize) * this.gridSize;

        if (Math.abs(x - gridSnappedX) < this.snapThreshold) {
            snappedX = gridSnappedX;
        }
        if (Math.abs(y - gridSnappedY) < this.snapThreshold) {
            snappedY = gridSnappedY;
        }

        // 다른 요소들과의 스냅
        if (this.currentData && this.currentData.elements) {
            this.currentData.elements.forEach((element, index) => {
                if (index === currentIndex) return; // 자기 자신은 제외

                const targetX = element.props.x || 0;
                const targetY = element.props.y || 0;
                const targetWidth = element.props.width || 100;
                const targetHeight = element.props.height || 100;

                // X축 스냅 (좌측, 중앙, 우측)
                const snapPoints = [
                    { pos: targetX, type: 'left' },
                    { pos: targetX + targetWidth / 2, type: 'center' },
                    { pos: targetX + targetWidth, type: 'right' }
                ];

                snapPoints.forEach(point => {
                    if (Math.abs(x - point.pos) < this.snapThreshold) {
                        snappedX = point.pos;
                        guidelines.push({
                            type: 'vertical',
                            pos: point.pos,
                            label: point.type
                        });
                    }
                });

                // Y축 스냅 (상단, 중앙, 하단)
                const snapPointsY = [
                    { pos: targetY, type: 'top' },
                    { pos: targetY + targetHeight / 2, type: 'middle' },
                    { pos: targetY + targetHeight, type: 'bottom' }
                ];

                snapPointsY.forEach(point => {
                    if (Math.abs(y - point.pos) < this.snapThreshold) {
                        snappedY = point.pos;
                        guidelines.push({
                            type: 'horizontal',
                            pos: point.pos,
                            label: point.type
                        });
                    }
                });
            });
        }

        return { x: snappedX, y: snappedY, guidelines };
    }

    // 가이드라인 표시
    showGuidelines(guidelines) {
        this.clearGuidelines();

        const wrapper = this.canvas.querySelector('.wireframe-wrapper');
        if (!wrapper) return;

        guidelines.forEach(guide => {
            const line = document.createElement('div');
            line.className = 'snap-guideline';
            line.classList.add(guide.type);

            if (guide.type === 'vertical') {
                line.style.left = guide.pos + 'px';
                line.style.top = '0';
                line.style.height = '100%';
                line.style.width = '1px';
            } else {
                line.style.top = guide.pos + 'px';
                line.style.left = '0';
                line.style.width = '100%';
                line.style.height = '1px';
            }

            wrapper.appendChild(line);
            this.guidelines.push(line);
        });
    }

    // 가이드라인 제거
    clearGuidelines() {
        this.guidelines.forEach(line => line.remove());
        this.guidelines = [];
    }

    // 새 컴포넌트 추가
    addNewComponent(component, x, y) {
        if (!this.currentData) return;

        // 스냅 적용
        const snapped = this.applySnap(x, y, -1);
        x = snapped.x;
        y = snapped.y;

        // 예제 코드를 파싱하여 속성 추출
        const lines = component.example.split('\n');
        let code = lines[0]; // 첫 줄 (컴포넌트 타입과 라벨)

        // x, y 값을 추가/수정
        let hasPosition = false;
        let newLines = [lines[0]];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('x:') || line.includes('y:')) {
                hasPosition = true;
            }
            newLines.push(line);
        }

        // x, y가 없으면 추가
        if (!hasPosition) {
            // 두 번째 줄에 x, y 추가
            newLines.splice(1, 0, `  x: ${x}, y: ${y}`);
        } else {
            // 기존 x, y 값 대체
            newLines = newLines.map(line => {
                if (line.includes('x:')) {
                    return line.replace(/x:\s*\d+/, `x: ${x}`);
                } else if (line.includes('y:')) {
                    return line.replace(/y:\s*\d+/, `y: ${y}`);
                }
                return line;
            });
        }

        const newCode = newLines.join('\n');

        // 코드 업데이트 콜백 호출
        if (this.onCodeUpdate) {
            this.onCodeUpdate('add', newCode);
        }
    }

    render(data) {
        // 캔버스 초기화
        this.canvas.innerHTML = '';
        this.currentData = data;

        // 와이어프레임을 담을 wrapper 생성
        const wrapper = document.createElement('div');
        wrapper.className = 'wireframe-wrapper';
        wrapper.style.width = data.page.width + 'px';
        wrapper.style.height = data.page.height + 'px';
        wrapper.style.position = 'relative';
        wrapper.style.background = 'white';
        wrapper.style.border = '1px solid #ddd';
        wrapper.style.margin = '0 auto';

        // 페이지 제목이 있으면 표시
        if (data.page.title) {
            const title = document.createElement('div');
            title.textContent = data.page.title;
            title.style.position = 'absolute';
            title.style.top = '10px';
            title.style.left = '10px';
            title.style.fontSize = '12px';
            title.style.color = '#999';
            wrapper.appendChild(title);
        }

        // 각 요소 렌더링
        for (let i = 0; i < data.elements.length; i++) {
            const element = data.elements[i];
            const rendered = this.renderElement(element);
            if (rendered) {
                // 드래그 가능하도록 설정
                this.makeDraggable(rendered, element, i);
                wrapper.appendChild(rendered);
            }
        }

        // wrapper를 캔버스에 추가
        this.canvas.appendChild(wrapper);
    }

    // 요소를 드래그 가능하게 만들기
    makeDraggable(domElement, dataElement, index) {
        domElement.setAttribute('draggable', 'true');
        domElement.style.cursor = 'move';
        domElement.dataset.elementIndex = index;

        // 드래그 시작
        domElement.addEventListener('dragstart', (e) => {
            this.draggedElement = {
                domElement: domElement,
                dataElement: dataElement,
                index: index,
                startX: dataElement.props.x || 0,
                startY: dataElement.props.y || 0,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            };
            domElement.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });

        // 드래그 종료
        domElement.addEventListener('dragend', (e) => {
            domElement.style.opacity = '1';
            this.clearGuidelines();

            // 컨테이너 하이라이트 제거
            const prevHighlighted = this.canvas.querySelectorAll('.container-highlight');
            prevHighlighted.forEach(el => el.classList.remove('container-highlight'));

            if (this.draggedElement) {
                const wrapper = this.canvas.querySelector('.wireframe-wrapper');
                const rect = wrapper.getBoundingClientRect();

                // 새 위치 계산
                let newX = Math.round(e.clientX - rect.left - this.draggedElement.offsetX);
                let newY = Math.round(e.clientY - rect.top - this.draggedElement.offsetY);

                // 스냅 적용
                const snapped = this.applySnap(newX, newY, this.draggedElement.index);
                newX = snapped.x;
                newY = snapped.y;

                // 위치가 실제로 변경된 경우에만 업데이트
                if (newX !== this.draggedElement.startX || newY !== this.draggedElement.startY) {
                    this.updateElementPosition(this.draggedElement.index, newX, newY);
                }

                this.draggedElement = null;
            }
        });

        // 호버 효과
        domElement.addEventListener('mouseenter', () => {
            domElement.style.outline = '2px dashed #3498db';
        });

        domElement.addEventListener('mouseleave', () => {
            domElement.style.outline = 'none';
        });
    }

    // 요소 위치 업데이트
    updateElementPosition(index, newX, newY) {
        if (!this.currentData || !this.currentData.elements[index]) return;

        const element = this.currentData.elements[index];

        // 코드 업데이트 콜백 호출
        if (this.onCodeUpdate) {
            this.onCodeUpdate('move', { element, index, newX, newY });
        }
    }

    renderElement(element) {
        const methods = {
            // 기존 컴포넌트
            container: this.renderContainer.bind(this),
            button: this.renderButton.bind(this),
            text: this.renderText.bind(this),
            input: this.renderInput.bind(this),
            image: this.renderImage.bind(this),
            navbar: this.renderNavbar.bind(this),
            grid: this.renderGrid.bind(this),

            // 폼 요소
            checkbox: this.renderCheckbox.bind(this),
            radio: this.renderRadio.bind(this),
            dropdown: this.renderDropdown.bind(this),
            textarea: this.renderTextarea.bind(this),
            toggle: this.renderToggle.bind(this),
            slider: this.renderSlider.bind(this),

            // 레이아웃 요소
            card: this.renderCard.bind(this),
            sidebar: this.renderSidebar.bind(this),
            header: this.renderHeader.bind(this),
            footer: this.renderFooter.bind(this),
            modal: this.renderModal.bind(this),

            // 네비게이션
            tabs: this.renderTabs.bind(this),
            breadcrumb: this.renderBreadcrumb.bind(this),
            pagination: this.renderPagination.bind(this),
            menu: this.renderMenu.bind(this),

            // 데이터 표시
            table: this.renderTable.bind(this),
            list: this.renderList.bind(this),

            // 피드백 요소
            alert: this.renderAlert.bind(this),
            badge: this.renderBadge.bind(this),
            progress: this.renderProgress.bind(this),

            // 미디어
            video: this.renderVideo.bind(this),
            icon: this.renderIcon.bind(this),

            // 차트/맵
            chart: this.renderChart.bind(this),
            map: this.renderMap.bind(this),

            // 기타
            divider: this.renderDivider.bind(this),
            avatar: this.renderAvatar.bind(this),
            tooltip: this.renderTooltip.bind(this)
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

    // ===== 폼 요소 =====
    renderCheckbox(element) {
        const wrapper = document.createElement('div');
        wrapper.className = 'wf-checkbox-wrapper';
        this.applyStyles(wrapper, {
            left: element.props.x + 'px',
            top: element.props.y + 'px'
        });

        const checkbox = document.createElement('div');
        checkbox.className = 'wf-checkbox';
        this.applyStyles(checkbox, {
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        wrapper.appendChild(checkbox);

        if (element.label) {
            const label = document.createElement('span');
            label.textContent = element.label;
            label.style.marginLeft = '8px';
            label.style.fontSize = '14px';
            wrapper.appendChild(label);
        }

        return wrapper;
    }

    renderRadio(element) {
        const wrapper = document.createElement('div');
        wrapper.className = 'wf-radio-wrapper';
        this.applyStyles(wrapper, {
            left: element.props.x + 'px',
            top: element.props.y + 'px'
        });

        const radio = document.createElement('div');
        radio.className = 'wf-radio';
        this.applyStyles(radio, {
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        wrapper.appendChild(radio);

        if (element.label) {
            const label = document.createElement('span');
            label.textContent = element.label;
            label.style.marginLeft = '8px';
            label.style.fontSize = '14px';
            wrapper.appendChild(label);
        }

        return wrapper;
    }

    renderDropdown(element) {
        const dropdown = document.createElement('div');
        dropdown.className = 'wf-dropdown';
        dropdown.textContent = element.label || 'Select...';
        this.applyStyles(dropdown, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const arrow = document.createElement('span');
        arrow.textContent = '▼';
        arrow.style.position = 'absolute';
        arrow.style.right = '10px';
        arrow.style.fontSize = '12px';
        dropdown.appendChild(arrow);

        return dropdown;
    }

    renderTextarea(element) {
        const textarea = document.createElement('div');
        textarea.className = 'wf-textarea';
        textarea.textContent = element.label || 'Textarea...';
        this.applyStyles(textarea, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return textarea;
    }

    renderToggle(element) {
        const toggle = document.createElement('div');
        toggle.className = 'wf-toggle';
        this.applyStyles(toggle, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const knob = document.createElement('div');
        knob.className = 'wf-toggle-knob';
        toggle.appendChild(knob);

        if (element.label) {
            const label = document.createElement('span');
            label.textContent = element.label;
            label.style.position = 'absolute';
            label.style.left = (element.props.width + 10) + 'px';
            label.style.fontSize = '14px';
            toggle.appendChild(label);
        }

        return toggle;
    }

    renderSlider(element) {
        const slider = document.createElement('div');
        slider.className = 'wf-slider';
        this.applyStyles(slider, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return slider;
    }

    // ===== 레이아웃 요소 =====
    renderCard(element) {
        const card = document.createElement('div');
        card.className = 'wf-card';
        this.applyStyles(card, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        if (element.label) {
            const title = document.createElement('div');
            title.className = 'wf-card-title';
            title.textContent = element.label;
            card.appendChild(title);

            const content = document.createElement('div');
            content.className = 'wf-card-content';
            content.textContent = 'Card content';
            card.appendChild(content);
        }

        return card;
    }

    renderSidebar(element) {
        const sidebar = document.createElement('div');
        sidebar.className = 'wf-sidebar';
        this.applyStyles(sidebar, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        if (element.label) {
            const title = document.createElement('div');
            title.textContent = element.label;
            title.style.padding = '15px';
            title.style.fontWeight = 'bold';
            sidebar.appendChild(title);
        }

        return sidebar;
    }

    renderHeader(element) {
        const header = document.createElement('div');
        header.className = 'wf-header';
        this.applyStyles(header, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px',
            background: element.props.background || '#34495e'
        });

        if (element.label) {
            const title = document.createElement('div');
            title.textContent = element.label;
            title.style.padding = '0 20px';
            title.style.fontSize = '20px';
            title.style.fontWeight = 'bold';
            header.appendChild(title);
        }

        return header;
    }

    renderFooter(element) {
        const footer = document.createElement('div');
        footer.className = 'wf-footer';
        this.applyStyles(footer, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px',
            background: element.props.background || '#2c3e50'
        });

        if (element.label) {
            const text = document.createElement('div');
            text.textContent = element.label;
            text.style.padding = '0 20px';
            footer.appendChild(text);
        }

        return footer;
    }

    renderModal(element) {
        const modal = document.createElement('div');
        modal.className = 'wf-modal';
        this.applyStyles(modal, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const header = document.createElement('div');
        header.className = 'wf-modal-header';
        header.textContent = element.label || 'Modal Title';
        modal.appendChild(header);

        const content = document.createElement('div');
        content.className = 'wf-modal-content';
        content.textContent = 'Modal content';
        modal.appendChild(content);

        return modal;
    }

    // ===== 네비게이션 =====
    renderTabs(element) {
        const tabs = document.createElement('div');
        tabs.className = 'wf-tabs';
        this.applyStyles(tabs, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const items = Array.isArray(element.props.items) ? element.props.items : ['Tab 1', 'Tab 2', 'Tab 3'];
        items.forEach((item, index) => {
            const tab = document.createElement('div');
            tab.className = 'wf-tab' + (index === 0 ? ' active' : '');
            tab.textContent = item;
            tabs.appendChild(tab);
        });

        return tabs;
    }

    renderBreadcrumb(element) {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'wf-breadcrumb';
        this.applyStyles(breadcrumb, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const items = Array.isArray(element.props.items) ? element.props.items : ['Home', 'Page', 'Current'];
        items.forEach((item, index) => {
            const crumb = document.createElement('span');
            crumb.className = 'wf-breadcrumb-item';
            crumb.textContent = item;
            breadcrumb.appendChild(crumb);

            if (index < items.length - 1) {
                const separator = document.createElement('span');
                separator.textContent = ' / ';
                separator.style.margin = '0 5px';
                breadcrumb.appendChild(separator);
            }
        });

        return breadcrumb;
    }

    renderPagination(element) {
        const pagination = document.createElement('div');
        pagination.className = 'wf-pagination';
        this.applyStyles(pagination, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const pages = element.props.pages || 5;
        for (let i = 1; i <= pages; i++) {
            const page = document.createElement('div');
            page.className = 'wf-pagination-item' + (i === 1 ? ' active' : '');
            page.textContent = i;
            pagination.appendChild(page);
        }

        return pagination;
    }

    renderMenu(element) {
        const menu = document.createElement('div');
        menu.className = 'wf-menu';
        this.applyStyles(menu, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const items = Array.isArray(element.props.items) ? element.props.items : ['Menu Item 1', 'Menu Item 2', 'Menu Item 3'];
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'wf-menu-item';
            menuItem.textContent = item;
            menu.appendChild(menuItem);
        });

        return menu;
    }

    // ===== 데이터 표시 =====
    renderTable(element) {
        const table = document.createElement('div');
        table.className = 'wf-table';
        this.applyStyles(table, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const rows = element.props.rows || 5;
        const columns = element.props.columns || 4;

        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'wf-table-row' + (i === 0 ? ' header' : '');

            for (let j = 0; j < columns; j++) {
                const cell = document.createElement('div');
                cell.className = 'wf-table-cell';
                cell.textContent = i === 0 ? `Col ${j + 1}` : `Data`;
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        return table;
    }

    renderList(element) {
        const list = document.createElement('div');
        list.className = 'wf-list';
        this.applyStyles(list, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const items = Array.isArray(element.props.items) ? element.props.items : ['List item 1', 'List item 2', 'List item 3'];
        items.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'wf-list-item';
            listItem.textContent = '• ' + item;
            list.appendChild(listItem);
        });

        return list;
    }

    // ===== 피드백 요소 =====
    renderAlert(element) {
        const alert = document.createElement('div');
        alert.className = 'wf-alert ' + (element.props.type || 'info');
        alert.textContent = element.label || 'This is an alert message';
        this.applyStyles(alert, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return alert;
    }

    renderBadge(element) {
        const badge = document.createElement('div');
        badge.className = 'wf-badge';
        badge.textContent = element.label || '5';
        this.applyStyles(badge, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return badge;
    }

    renderProgress(element) {
        const progress = document.createElement('div');
        progress.className = 'wf-progress';
        this.applyStyles(progress, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const bar = document.createElement('div');
        bar.className = 'wf-progress-bar';
        bar.style.width = (element.props.value || 50) + '%';
        progress.appendChild(bar);

        return progress;
    }

    // ===== 미디어 =====
    renderVideo(element) {
        const video = document.createElement('div');
        video.className = 'wf-video';
        this.applyStyles(video, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const icon = document.createElement('div');
        icon.innerHTML = '▶️';
        icon.style.fontSize = '48px';
        icon.style.marginBottom = '10px';

        const label = document.createElement('div');
        label.textContent = element.label || 'Video';

        video.appendChild(icon);
        video.appendChild(label);

        return video;
    }

    renderIcon(element) {
        const icon = document.createElement('div');
        icon.className = 'wf-icon';

        // 아이콘 라이브러리 - 다양한 카테고리별 아이콘
        const iconLibrary = {
            // UI 아이콘
            'home': '🏠',
            'search': '🔍',
            'settings': '⚙️',
            'menu': '☰',
            'close': '✕',
            'check': '✓',
            'plus': '+',
            'minus': '-',
            'edit': '✏️',
            'delete': '🗑️',
            'save': '💾',
            'download': '⬇️',
            'upload': '⬆️',
            'refresh': '🔄',
            'filter': '🔽',
            'sort': '⇅',

            // 소셜 미디어
            'facebook': 'f',
            'twitter': '🐦',
            'instagram': '📷',
            'linkedin': 'in',
            'youtube': '▶',
            'github': '😺',

            // 비즈니스
            'user': '👤',
            'users': '👥',
            'briefcase': '💼',
            'calendar': '📅',
            'clock': '🕐',
            'mail': '✉️',
            'phone': '📞',
            'location': '📍',
            'chart': '📊',
            'document': '📄',
            'folder': '📁',
            'tag': '🏷️',

            // 상태/피드백
            'success': '✓',
            'error': '✗',
            'warning': '⚠️',
            'info': 'ℹ️',
            'help': '?',
            'star': '⭐',
            'heart': '❤️',
            'like': '👍',

            // 미디어
            'play': '▶',
            'pause': '⏸',
            'stop': '⏹',
            'forward': '⏩',
            'backward': '⏪',
            'volume': '🔊',
            'mute': '🔇',
            'camera': '📷',
            'image': '🖼️',
            'video': '🎥',

            // 방향
            'arrow-up': '↑',
            'arrow-down': '↓',
            'arrow-left': '←',
            'arrow-right': '→',
            'chevron-up': '⌃',
            'chevron-down': '⌄',
            'chevron-left': '‹',
            'chevron-right': '›'
        };

        // 라벨이나 iconType으로 아이콘 결정
        const iconType = element.props.iconType || element.label;
        icon.textContent = iconLibrary[iconType] || element.label || '⭐';

        this.applyStyles(icon, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            fontSize: element.props.size + 'px'
        });
        return icon;
    }

    // ===== 차트/맵 =====
    renderChart(element) {
        const chart = document.createElement('div');
        chart.className = 'wf-chart';
        this.applyStyles(chart, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const chartType = element.props.type || 'bar';

        // 차트 타입별 시각화
        const chartVisuals = {
            'bar': this.renderBarChart,
            'line': this.renderLineChart,
            'pie': this.renderPieChart,
            'donut': this.renderDonutChart,
            'area': this.renderAreaChart,
            'scatter': this.renderScatterChart,
            'radar': this.renderRadarChart,
            'gauge': this.renderGaugeChart
        };

        const renderMethod = chartVisuals[chartType];
        if (renderMethod) {
            const visual = renderMethod.call(this, element);
            chart.appendChild(visual);
        }

        const label = document.createElement('div');
        label.textContent = element.label || chartType + ' chart';
        label.style.marginTop = '10px';
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        chart.appendChild(label);

        return chart;
    }

    renderBarChart(element) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; align-items: flex-end; justify-content: space-around; height: 80%; padding: 10px;';

        const bars = [60, 80, 45, 90, 70];
        bars.forEach(height => {
            const bar = document.createElement('div');
            bar.style.cssText = `width: 15%; background: #3498db; height: ${height}%; border-radius: 3px 3px 0 0;`;
            container.appendChild(bar);
        });

        return container;
    }

    renderLineChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 200 100');

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', '10,80 50,40 90,60 130,20 170,50');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#e74c3c');
        polyline.setAttribute('stroke-width', '2');

        svg.appendChild(polyline);
        return svg;
    }

    renderPieChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 100 100');

        const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
        const angles = [0, 120, 200, 280, 360];

        for (let i = 0; i < angles.length - 1; i++) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const startAngle = (angles[i] - 90) * Math.PI / 180;
            const endAngle = (angles[i + 1] - 90) * Math.PI / 180;
            const x1 = 50 + 40 * Math.cos(startAngle);
            const y1 = 50 + 40 * Math.sin(startAngle);
            const x2 = 50 + 40 * Math.cos(endAngle);
            const y2 = 50 + 40 * Math.sin(endAngle);
            const largeArc = (angles[i + 1] - angles[i]) > 180 ? 1 : 0;

            path.setAttribute('d', `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`);
            path.setAttribute('fill', colors[i]);
            svg.appendChild(path);
        }

        return svg;
    }

    renderDonutChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 100 100');

        const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle1.setAttribute('cx', '50');
        circle1.setAttribute('cy', '50');
        circle1.setAttribute('r', '30');
        circle1.setAttribute('fill', 'none');
        circle1.setAttribute('stroke', '#3498db');
        circle1.setAttribute('stroke-width', '20');
        circle1.setAttribute('stroke-dasharray', '120 188');

        const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle2.setAttribute('cx', '50');
        circle2.setAttribute('cy', '50');
        circle2.setAttribute('r', '30');
        circle2.setAttribute('fill', 'none');
        circle2.setAttribute('stroke', '#e74c3c');
        circle2.setAttribute('stroke-width', '20');
        circle2.setAttribute('stroke-dasharray', '68 188');
        circle2.setAttribute('stroke-dashoffset', '-120');

        svg.appendChild(circle1);
        svg.appendChild(circle2);
        return svg;
    }

    renderAreaChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 200 100');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '10,90 10,60 50,40 90,55 130,25 170,45 170,90');
        polygon.setAttribute('fill', 'rgba(46, 204, 113, 0.3)');
        polygon.setAttribute('stroke', '#2ecc71');
        polygon.setAttribute('stroke-width', '2');

        svg.appendChild(polygon);
        return svg;
    }

    renderScatterChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 200 100');

        const points = [
            [20, 70], [40, 50], [35, 80], [60, 40], [80, 60],
            [90, 30], [110, 70], [130, 45], [150, 55], [170, 35]
        ];

        points.forEach(([x, y]) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '3');
            circle.setAttribute('fill', '#9b59b6');
            svg.appendChild(circle);
        });

        return svg;
    }

    renderRadarChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 100 100');

        // 배경 육각형
        for (let i = 3; i >= 1; i--) {
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const scale = i / 3;
            const points = [];
            for (let j = 0; j < 6; j++) {
                const angle = (j * 60 - 90) * Math.PI / 180;
                const x = 50 + 30 * scale * Math.cos(angle);
                const y = 50 + 30 * scale * Math.sin(angle);
                points.push(`${x},${y}`);
            }
            polygon.setAttribute('points', points.join(' '));
            polygon.setAttribute('fill', 'none');
            polygon.setAttribute('stroke', '#ddd');
            polygon.setAttribute('stroke-width', '1');
            svg.appendChild(polygon);
        }

        // 데이터 폴리곤
        const dataPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const dataPoints = [];
        const values = [0.8, 0.6, 0.9, 0.7, 0.5, 0.85];
        for (let j = 0; j < 6; j++) {
            const angle = (j * 60 - 90) * Math.PI / 180;
            const x = 50 + 30 * values[j] * Math.cos(angle);
            const y = 50 + 30 * values[j] * Math.sin(angle);
            dataPoints.push(`${x},${y}`);
        }
        dataPolygon.setAttribute('points', dataPoints.join(' '));
        dataPolygon.setAttribute('fill', 'rgba(52, 152, 219, 0.3)');
        dataPolygon.setAttribute('stroke', '#3498db');
        dataPolygon.setAttribute('stroke-width', '2');
        svg.appendChild(dataPolygon);

        return svg;
    }

    renderGaugeChart(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '80%');
        svg.setAttribute('viewBox', '0 0 100 60');

        // 배경 아크
        const bgArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bgArc.setAttribute('d', 'M 10 50 A 40 40 0 0 1 90 50');
        bgArc.setAttribute('fill', 'none');
        bgArc.setAttribute('stroke', '#ecf0f1');
        bgArc.setAttribute('stroke-width', '8');

        // 값 아크 (75%)
        const valueArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        valueArc.setAttribute('d', 'M 10 50 A 40 40 0 0 1 80 20');
        valueArc.setAttribute('fill', 'none');
        valueArc.setAttribute('stroke', '#2ecc71');
        valueArc.setAttribute('stroke-width', '8');
        valueArc.setAttribute('stroke-linecap', 'round');

        svg.appendChild(bgArc);
        svg.appendChild(valueArc);

        return svg;
    }

    renderMap(element) {
        const map = document.createElement('div');
        map.className = 'wf-map';
        this.applyStyles(map, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });

        const icon = document.createElement('div');
        icon.innerHTML = '🗺️';
        icon.style.fontSize = '48px';
        icon.style.marginBottom = '10px';

        const label = document.createElement('div');
        label.textContent = element.label || 'Map';

        map.appendChild(icon);
        map.appendChild(label);

        return map;
    }

    // ===== 기타 =====
    renderDivider(element) {
        const divider = document.createElement('div');
        divider.className = 'wf-divider';
        this.applyStyles(divider, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return divider;
    }

    renderAvatar(element) {
        const avatar = document.createElement('div');
        avatar.className = 'wf-avatar';
        avatar.textContent = element.label || '👤';
        this.applyStyles(avatar, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.size + 'px',
            height: element.props.size + 'px',
            fontSize: (element.props.size * 0.6) + 'px'
        });
        return avatar;
    }

    renderTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'wf-tooltip';
        tooltip.textContent = element.label || 'Tooltip text';
        this.applyStyles(tooltip, {
            left: element.props.x + 'px',
            top: element.props.y + 'px',
            width: element.props.width + 'px',
            height: element.props.height + 'px'
        });
        return tooltip;
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
