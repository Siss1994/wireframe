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
        for (const element of data.elements) {
            const rendered = this.renderElement(element);
            if (rendered) {
                wrapper.appendChild(rendered);
            }
        }

        // wrapper를 캔버스에 추가
        this.canvas.appendChild(wrapper);
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
        icon.textContent = element.label || '⭐';
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

        const icon = document.createElement('div');
        icon.innerHTML = '📊';
        icon.style.fontSize = '48px';
        icon.style.marginBottom = '10px';

        const label = document.createElement('div');
        label.textContent = element.label || (element.props.type || 'bar') + ' chart';

        chart.appendChild(icon);
        chart.appendChild(label);

        return chart;
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
