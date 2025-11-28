/**
 * Diagram Renderer
 * 파싱된 다이어그램 데이터를 SVG로 렌더링
 */

class DiagramRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svg = null;
        this.config = {
            flowchart: {
                nodeWidth: 150,
                nodeHeight: 50,
                nodeSpacingX: 80,
                nodeSpacingY: 80,
                padding: 50
            },
            sequence: {
                participantWidth: 120,
                participantHeight: 40,
                participantSpacing: 180,
                messageSpacing: 50,
                padding: 40
            },
            state: {
                stateWidth: 140,
                stateHeight: 50,
                stateSpacing: 100,
                padding: 50
            },
            mindmap: {
                nodeMinWidth: 80,
                nodeHeight: 36,
                levelSpacing: 150,
                siblingSpacing: 20,
                padding: 50
            },
            pie: {
                radius: 150,
                padding: 60
            },
            class: {
                classWidth: 180,
                classMinHeight: 80,
                classSpacing: 60,
                padding: 50
            },
            er: {
                entityWidth: 160,
                entityMinHeight: 60,
                entitySpacing: 80,
                padding: 50
            },
            gantt: {
                rowHeight: 35,
                labelWidth: 150,
                dayWidth: 30,
                padding: 40
            },
            journey: {
                stepWidth: 120,
                stepHeight: 80,
                padding: 40
            },
            wireframe: {
                mobile: { width: 375, height: 667 },
                tablet: { width: 768, height: 1024 },
                desktop: { width: 1200, height: 800 },
                padding: 20,
                componentSpacing: 12
            }
        };
    }

    render(data) {
        this.container.innerHTML = '';

        switch (data.type) {
            case 'flowchart':
                return this.renderFlowchart(data);
            case 'sequenceDiagram':
                return this.renderSequenceDiagram(data);
            case 'stateDiagram':
                return this.renderStateDiagram(data);
            case 'mindmap':
                return this.renderMindmap(data);
            case 'pie':
                return this.renderPieChart(data);
            case 'classDiagram':
                return this.renderClassDiagram(data);
            case 'erDiagram':
                return this.renderErDiagram(data);
            case 'gantt':
                return this.renderGantt(data);
            case 'journey':
                return this.renderJourney(data);
            case 'wireframe':
                return this.renderWireframe(data);
            default:
                this.showError('알 수 없는 다이어그램 타입입니다.');
        }
    }

    // ===== SVG 헬퍼 함수 =====
    createSvg(width, height) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.background = '#ffffff';

        // 화살표 마커 정의
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // 일반 화살표
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#333');
        marker.appendChild(polygon);
        defs.appendChild(marker);

        // 굵은 화살표
        const thickMarker = marker.cloneNode(true);
        thickMarker.setAttribute('id', 'arrowhead-thick');
        thickMarker.querySelector('polygon').setAttribute('fill', '#333');
        defs.appendChild(thickMarker);

        // 그림자 필터
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'shadow');
        filter.setAttribute('x', '-20%');
        filter.setAttribute('y', '-20%');
        filter.setAttribute('width', '140%');
        filter.setAttribute('height', '140%');

        const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
        feDropShadow.setAttribute('dx', '2');
        feDropShadow.setAttribute('dy', '2');
        feDropShadow.setAttribute('stdDeviation', '3');
        feDropShadow.setAttribute('flood-color', 'rgba(0,0,0,0.15)');
        filter.appendChild(feDropShadow);
        defs.appendChild(filter);

        svg.appendChild(defs);
        return svg;
    }

    createRect(x, y, width, height, options = {}) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('rx', options.rx || 5);
        rect.setAttribute('ry', options.ry || 5);
        rect.setAttribute('fill', options.fill || '#4ECDC4');
        rect.setAttribute('stroke', options.stroke || '#2C3E50');
        rect.setAttribute('stroke-width', options.strokeWidth || 2);
        if (options.filter) rect.setAttribute('filter', options.filter);
        return rect;
    }

    createText(x, y, text, options = {}) {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('text-anchor', options.anchor || 'middle');
        textEl.setAttribute('dominant-baseline', options.baseline || 'middle');
        textEl.setAttribute('fill', options.fill || '#2C3E50');
        textEl.setAttribute('font-size', options.fontSize || '14');
        textEl.setAttribute('font-family', options.fontFamily || 'Arial, sans-serif');
        if (options.fontWeight) textEl.setAttribute('font-weight', options.fontWeight);
        textEl.textContent = text;
        return textEl;
    }

    createLine(x1, y1, x2, y2, options = {}) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', options.stroke || '#333');
        line.setAttribute('stroke-width', options.strokeWidth || 2);
        if (options.strokeDasharray) line.setAttribute('stroke-dasharray', options.strokeDasharray);
        if (options.markerEnd) line.setAttribute('marker-end', options.markerEnd);
        return line;
    }

    createPath(d, options = {}) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', options.fill || 'none');
        path.setAttribute('stroke', options.stroke || '#333');
        path.setAttribute('stroke-width', options.strokeWidth || 2);
        if (options.strokeDasharray) path.setAttribute('stroke-dasharray', options.strokeDasharray);
        if (options.markerEnd) path.setAttribute('marker-end', options.markerEnd);
        return path;
    }

    createCircle(cx, cy, r, options = {}) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', options.fill || '#4ECDC4');
        circle.setAttribute('stroke', options.stroke || '#2C3E50');
        circle.setAttribute('stroke-width', options.strokeWidth || 2);
        return circle;
    }

    createEllipse(cx, cy, rx, ry, options = {}) {
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse.setAttribute('cx', cx);
        ellipse.setAttribute('cy', cy);
        ellipse.setAttribute('rx', rx);
        ellipse.setAttribute('ry', ry);
        ellipse.setAttribute('fill', options.fill || '#4ECDC4');
        ellipse.setAttribute('stroke', options.stroke || '#2C3E50');
        ellipse.setAttribute('stroke-width', options.strokeWidth || 2);
        return ellipse;
    }

    createDiamond(cx, cy, width, height, options = {}) {
        const points = [
            `${cx},${cy - height / 2}`,
            `${cx + width / 2},${cy}`,
            `${cx},${cy + height / 2}`,
            `${cx - width / 2},${cy}`
        ].join(' ');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', options.fill || '#FFE66D');
        polygon.setAttribute('stroke', options.stroke || '#2C3E50');
        polygon.setAttribute('stroke-width', options.strokeWidth || 2);
        return polygon;
    }

    createGroup() {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    }

    // ===== Flowchart Renderer =====
    renderFlowchart(data) {
        const cfg = this.config.flowchart;
        const isHorizontal = data.direction === 'LR' || data.direction === 'RL';

        // 노드 위치 계산 (간단한 레이아웃)
        const positions = this.calculateFlowchartLayout(data, isHorizontal);

        // 전체 크기 계산
        let maxX = 0, maxY = 0;
        positions.forEach(pos => {
            maxX = Math.max(maxX, pos.x + cfg.nodeWidth);
            maxY = Math.max(maxY, pos.y + cfg.nodeHeight);
        });

        const width = maxX + cfg.padding * 2;
        const height = maxY + cfg.padding * 2;

        const svg = this.createSvg(width, height);

        // 엣지 먼저 그리기
        data.edges.forEach(edge => {
            const fromPos = positions.get(edge.from);
            const toPos = positions.get(edge.to);
            if (fromPos && toPos) {
                const edgeGroup = this.drawFlowchartEdge(fromPos, toPos, edge, isHorizontal, cfg);
                svg.appendChild(edgeGroup);
            }
        });

        // 노드 그리기
        data.nodes.forEach(node => {
            const pos = positions.get(node.id);
            if (pos) {
                const nodeGroup = this.drawFlowchartNode(node, pos.x, pos.y, cfg);
                svg.appendChild(nodeGroup);
            }
        });

        this.container.appendChild(svg);
        return svg;
    }

    calculateFlowchartLayout(data, isHorizontal) {
        const cfg = this.config.flowchart;
        const positions = new Map();

        // 레벨별로 노드 분류
        const levels = new Map();
        const visited = new Set();
        const nodeLevel = new Map();

        // 시작 노드 찾기 (들어오는 엣지가 없는 노드)
        const inDegree = new Map();
        data.nodes.forEach(n => inDegree.set(n.id, 0));
        data.edges.forEach(e => {
            inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1);
        });

        const startNodes = data.nodes.filter(n => inDegree.get(n.id) === 0);
        if (startNodes.length === 0 && data.nodes.length > 0) {
            startNodes.push(data.nodes[0]);
        }

        // BFS로 레벨 할당
        const queue = startNodes.map(n => ({ id: n.id, level: 0 }));
        startNodes.forEach(n => {
            visited.add(n.id);
            nodeLevel.set(n.id, 0);
        });

        while (queue.length > 0) {
            const { id, level } = queue.shift();

            if (!levels.has(level)) levels.set(level, []);
            levels.get(level).push(id);

            data.edges.filter(e => e.from === id).forEach(e => {
                if (!visited.has(e.to)) {
                    visited.add(e.to);
                    nodeLevel.set(e.to, level + 1);
                    queue.push({ id: e.to, level: level + 1 });
                }
            });
        }

        // 방문하지 않은 노드 처리
        data.nodes.forEach(n => {
            if (!visited.has(n.id)) {
                const maxLevel = Math.max(...Array.from(levels.keys()), 0);
                if (!levels.has(maxLevel + 1)) levels.set(maxLevel + 1, []);
                levels.get(maxLevel + 1).push(n.id);
            }
        });

        // 위치 계산
        const sortedLevels = Array.from(levels.keys()).sort((a, b) => a - b);
        sortedLevels.forEach((level, levelIdx) => {
            const nodesAtLevel = levels.get(level);
            nodesAtLevel.forEach((nodeId, nodeIdx) => {
                let x, y;
                if (isHorizontal) {
                    x = cfg.padding + levelIdx * (cfg.nodeWidth + cfg.nodeSpacingX);
                    y = cfg.padding + nodeIdx * (cfg.nodeHeight + cfg.nodeSpacingY);
                } else {
                    x = cfg.padding + nodeIdx * (cfg.nodeWidth + cfg.nodeSpacingX);
                    y = cfg.padding + levelIdx * (cfg.nodeHeight + cfg.nodeSpacingY);
                }
                positions.set(nodeId, { x, y });
            });
        });

        return positions;
    }

    drawFlowchartNode(node, x, y, cfg) {
        const group = this.createGroup();
        const cx = x + cfg.nodeWidth / 2;
        const cy = y + cfg.nodeHeight / 2;

        let shape;
        const colors = {
            rect: { fill: '#4ECDC4', stroke: '#2C3E50' },
            round: { fill: '#95E1D3', stroke: '#2C3E50' },
            diamond: { fill: '#FFE66D', stroke: '#2C3E50' },
            circle: { fill: '#FF6B6B', stroke: '#2C3E50' },
            subroutine: { fill: '#DDA0DD', stroke: '#2C3E50' }
        };

        const color = colors[node.shape] || colors.rect;

        switch (node.shape) {
            case 'round':
                shape = this.createRect(x, y, cfg.nodeWidth, cfg.nodeHeight, {
                    rx: 20, ry: 20, fill: color.fill, stroke: color.stroke, filter: 'url(#shadow)'
                });
                break;
            case 'diamond':
                shape = this.createDiamond(cx, cy, cfg.nodeWidth, cfg.nodeHeight, {
                    fill: color.fill, stroke: color.stroke
                });
                break;
            case 'circle':
                shape = this.createEllipse(cx, cy, cfg.nodeWidth / 2, cfg.nodeHeight / 2, {
                    fill: color.fill, stroke: color.stroke
                });
                break;
            case 'subroutine':
                shape = this.createRect(x, y, cfg.nodeWidth, cfg.nodeHeight, {
                    rx: 0, ry: 0, fill: color.fill, stroke: color.stroke
                });
                // 서브루틴 양쪽 선 추가
                group.appendChild(shape);
                group.appendChild(this.createLine(x + 10, y, x + 10, y + cfg.nodeHeight, { stroke: color.stroke }));
                group.appendChild(this.createLine(x + cfg.nodeWidth - 10, y, x + cfg.nodeWidth - 10, y + cfg.nodeHeight, { stroke: color.stroke }));
                shape = null;
                break;
            default:
                shape = this.createRect(x, y, cfg.nodeWidth, cfg.nodeHeight, {
                    fill: color.fill, stroke: color.stroke, filter: 'url(#shadow)'
                });
        }

        if (shape) group.appendChild(shape);

        // 텍스트
        const text = this.createText(cx, cy, node.label, {
            fill: '#2C3E50', fontWeight: '500', fontSize: '14'
        });
        group.appendChild(text);

        return group;
    }

    drawFlowchartEdge(from, to, edge, isHorizontal, cfg) {
        const group = this.createGroup();

        const fromCx = from.x + cfg.nodeWidth / 2;
        const fromCy = from.y + cfg.nodeHeight / 2;
        const toCx = to.x + cfg.nodeWidth / 2;
        const toCy = to.y + cfg.nodeHeight / 2;

        let startX, startY, endX, endY;

        // 연결점 계산
        if (isHorizontal) {
            startX = from.x + cfg.nodeWidth;
            startY = fromCy;
            endX = to.x;
            endY = toCy;
        } else {
            startX = fromCx;
            startY = from.y + cfg.nodeHeight;
            endX = toCx;
            endY = to.y;
        }

        // 곡선 경로 생성
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        let pathD;
        if (Math.abs(startX - endX) < 10 || Math.abs(startY - endY) < 10) {
            // 직선
            pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
        } else {
            // 베지어 곡선
            if (isHorizontal) {
                pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
            } else {
                pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
            }
        }

        const strokeDash = edge.type === 'dotted' ? '5,5' : edge.type === 'thick' ? null : null;
        const strokeWidth = edge.type === 'thick' ? 3 : 2;

        const path = this.createPath(pathD, {
            stroke: '#333',
            strokeWidth,
            strokeDasharray: strokeDash,
            markerEnd: edge.hasArrow ? 'url(#arrowhead)' : null
        });
        group.appendChild(path);

        // 라벨
        if (edge.label) {
            const labelBg = this.createRect(midX - 20, midY - 10, 40, 20, {
                fill: '#fff', stroke: 'none', rx: 3
            });
            group.appendChild(labelBg);

            const labelText = this.createText(midX, midY, edge.label, {
                fontSize: '12', fill: '#666'
            });
            group.appendChild(labelText);
        }

        return group;
    }

    // ===== Sequence Diagram Renderer =====
    renderSequenceDiagram(data) {
        const cfg = this.config.sequence;

        const participantCount = data.participants.length;
        const messageCount = data.messages.filter(m => m.type !== 'activate' && m.type !== 'deactivate').length;

        const width = cfg.padding * 2 + participantCount * cfg.participantSpacing;
        const height = cfg.padding * 2 + cfg.participantHeight + messageCount * cfg.messageSpacing + 100;

        const svg = this.createSvg(width, height);

        // 참여자 위치 계산
        const participantPositions = new Map();
        data.participants.forEach((p, i) => {
            const x = cfg.padding + i * cfg.participantSpacing + cfg.participantSpacing / 2;
            participantPositions.set(p.id, x);
        });

        // 라이프라인 그리기
        data.participants.forEach((p, i) => {
            const x = participantPositions.get(p.id);
            const line = this.createLine(
                x, cfg.padding + cfg.participantHeight,
                x, height - cfg.padding - cfg.participantHeight,
                { stroke: '#bbb', strokeDasharray: '5,5', strokeWidth: 1 }
            );
            svg.appendChild(line);
        });

        // 참여자 박스 그리기 (상단)
        data.participants.forEach((p, i) => {
            const x = participantPositions.get(p.id);
            const group = this.drawParticipant(p, x - cfg.participantWidth / 2, cfg.padding, cfg);
            svg.appendChild(group);
        });

        // 메시지 그리기
        let messageY = cfg.padding + cfg.participantHeight + 40;
        data.messages.forEach(msg => {
            if (msg.type === 'note') {
                // 노트 그리기
                const noteGroup = this.drawNote(msg, participantPositions, messageY, cfg);
                svg.appendChild(noteGroup);
                messageY += 50;
            } else if (msg.type === 'activate' || msg.type === 'deactivate') {
                // activate/deactivate는 스킵 (간단 버전)
            } else {
                // 일반 메시지
                const msgGroup = this.drawMessage(msg, participantPositions, messageY, cfg);
                svg.appendChild(msgGroup);
                messageY += cfg.messageSpacing;
            }
        });

        // 참여자 박스 그리기 (하단)
        data.participants.forEach((p, i) => {
            const x = participantPositions.get(p.id);
            const group = this.drawParticipant(p, x - cfg.participantWidth / 2, height - cfg.padding - cfg.participantHeight, cfg);
            svg.appendChild(group);
        });

        this.container.appendChild(svg);
        return svg;
    }

    drawParticipant(participant, x, y, cfg) {
        const group = this.createGroup();

        if (participant.isActor) {
            // 액터 (스틱맨)
            const cx = x + cfg.participantWidth / 2;
            const cy = y + cfg.participantHeight / 2;

            // 머리
            group.appendChild(this.createCircle(cx, cy - 12, 8, { fill: '#fff', stroke: '#333', strokeWidth: 2 }));
            // 몸
            group.appendChild(this.createLine(cx, cy - 4, cx, cy + 8, { stroke: '#333' }));
            // 팔
            group.appendChild(this.createLine(cx - 10, cy, cx + 10, cy, { stroke: '#333' }));
            // 다리
            group.appendChild(this.createLine(cx, cy + 8, cx - 8, cy + 18, { stroke: '#333' }));
            group.appendChild(this.createLine(cx, cy + 8, cx + 8, cy + 18, { stroke: '#333' }));
        } else {
            // 일반 참여자 박스
            const rect = this.createRect(x, y, cfg.participantWidth, cfg.participantHeight, {
                fill: '#E8F4FD', stroke: '#3498DB', rx: 3
            });
            group.appendChild(rect);
        }

        // 이름
        const text = this.createText(x + cfg.participantWidth / 2, y + cfg.participantHeight + (participant.isActor ? 10 : -8) + 18, participant.alias, {
            fontSize: '13', fontWeight: '500', fill: '#2C3E50'
        });
        group.appendChild(text);

        return group;
    }

    drawMessage(msg, positions, y, cfg) {
        const group = this.createGroup();

        const fromX = positions.get(msg.from);
        const toX = positions.get(msg.to);

        if (!fromX || !toX) return group;

        const isLeft = fromX < toX;

        // 화살표 선
        const line = this.createLine(fromX, y, toX, y, {
            stroke: '#333',
            strokeDasharray: msg.isResponse ? '5,5' : null,
            markerEnd: 'url(#arrowhead)'
        });
        group.appendChild(line);

        // 메시지 텍스트
        const midX = (fromX + toX) / 2;
        const text = this.createText(midX, y - 8, msg.message, {
            fontSize: '12', fill: '#333'
        });
        group.appendChild(text);

        return group;
    }

    drawNote(note, positions, y, cfg) {
        const group = this.createGroup();

        const participants = note.participants;
        let x;

        if (participants.length === 1) {
            const px = positions.get(participants[0]);
            x = note.position === 'left of' ? px - 100 : px + 20;
        } else {
            const x1 = positions.get(participants[0]);
            const x2 = positions.get(participants[1]);
            x = (x1 + x2) / 2 - 40;
        }

        // 노트 박스
        const rect = this.createRect(x, y - 15, 80, 30, {
            fill: '#FFFACD', stroke: '#DDD', rx: 0
        });
        group.appendChild(rect);

        // 노트 텍스트
        const text = this.createText(x + 40, y, note.text, {
            fontSize: '11', fill: '#333'
        });
        group.appendChild(text);

        return group;
    }

    // ===== State Diagram Renderer =====
    renderStateDiagram(data) {
        const cfg = this.config.state;

        // 상태 위치 계산
        const positions = this.calculateStateLayout(data, cfg);

        let maxX = 0, maxY = 0;
        positions.forEach(pos => {
            maxX = Math.max(maxX, pos.x + cfg.stateWidth);
            maxY = Math.max(maxY, pos.y + cfg.stateHeight);
        });

        const width = maxX + cfg.padding * 2;
        const height = maxY + cfg.padding * 2;

        const svg = this.createSvg(width, height);

        // 전환 먼저 그리기
        data.transitions.forEach(trans => {
            const fromPos = positions.get(trans.from);
            const toPos = positions.get(trans.to);
            if (fromPos && toPos) {
                const transGroup = this.drawStateTransition(fromPos, toPos, trans, cfg);
                svg.appendChild(transGroup);
            }
        });

        // 상태 그리기
        positions.forEach((pos, stateId) => {
            const state = data.states.find(s => s.id === stateId);
            if (state) {
                const stateGroup = this.drawState(state, pos.x, pos.y, cfg);
                svg.appendChild(stateGroup);
            } else if (stateId === '__start__') {
                const startGroup = this.drawStartState(pos.x, pos.y);
                svg.appendChild(startGroup);
            } else if (stateId === '__end__') {
                const endGroup = this.drawEndState(pos.x, pos.y);
                svg.appendChild(endGroup);
            }
        });

        this.container.appendChild(svg);
        return svg;
    }

    calculateStateLayout(data, cfg) {
        const positions = new Map();
        const allStates = new Set();

        // 모든 상태 수집
        data.states.forEach(s => allStates.add(s.id));
        data.transitions.forEach(t => {
            allStates.add(t.from);
            allStates.add(t.to);
        });

        // 인접 리스트 생성
        const adjacency = new Map();
        allStates.forEach(s => adjacency.set(s, []));
        data.transitions.forEach(t => {
            if (adjacency.has(t.from)) {
                adjacency.get(t.from).push(t.to);
            }
        });

        // BFS로 레벨 계산
        const levels = new Map();
        const queue = [];

        // 시작점 찾기
        if (allStates.has('__start__')) {
            queue.push('__start__');
            levels.set('__start__', 0);
        } else {
            // 시작점이 없으면 들어오는 간선이 없는 노드를 시작점으로
            const hasIncoming = new Set();
            data.transitions.forEach(t => hasIncoming.add(t.to));
            allStates.forEach(s => {
                if (!hasIncoming.has(s) && s !== '__end__') {
                    queue.push(s);
                    levels.set(s, 0);
                }
            });
        }

        // BFS 실행
        while (queue.length > 0) {
            const current = queue.shift();
            const currentLevel = levels.get(current);
            const neighbors = adjacency.get(current) || [];

            neighbors.forEach(next => {
                if (!levels.has(next)) {
                    levels.set(next, currentLevel + 1);
                    queue.push(next);
                }
            });
        }

        // 방문하지 않은 상태 처리
        allStates.forEach(s => {
            if (!levels.has(s)) {
                levels.set(s, 0);
            }
        });

        // 레벨별 그룹핑
        const levelGroups = new Map();
        levels.forEach((level, stateId) => {
            if (!levelGroups.has(level)) levelGroups.set(level, []);
            levelGroups.get(level).push(stateId);
        });

        // 전체 너비 계산을 위해 최대 레벨의 상태 수 확인
        let maxStatesInLevel = 0;
        levelGroups.forEach(states => {
            maxStatesInLevel = Math.max(maxStatesInLevel, states.length);
        });

        // 위치 계산 - 가운데 정렬
        const totalWidth = maxStatesInLevel * (cfg.stateWidth + cfg.stateSpacing) - cfg.stateSpacing;

        levelGroups.forEach((states, level) => {
            const levelWidth = states.length * (cfg.stateWidth + cfg.stateSpacing) - cfg.stateSpacing;
            const startX = cfg.padding + (totalWidth - levelWidth) / 2;

            states.forEach((stateId, idx) => {
                const x = startX + idx * (cfg.stateWidth + cfg.stateSpacing);
                const y = cfg.padding + level * (cfg.stateHeight + cfg.stateSpacing);
                positions.set(stateId, { x, y });
            });
        });

        return positions;
    }

    drawState(state, x, y, cfg) {
        const group = this.createGroup();

        const rect = this.createRect(x, y, cfg.stateWidth, cfg.stateHeight, {
            fill: '#E8F8F5', stroke: '#1ABC9C', rx: 10, filter: 'url(#shadow)'
        });
        group.appendChild(rect);

        const text = this.createText(x + cfg.stateWidth / 2, y + cfg.stateHeight / 2, state.label, {
            fontSize: '14', fontWeight: '500', fill: '#2C3E50'
        });
        group.appendChild(text);

        return group;
    }

    drawStartState(x, y) {
        const group = this.createGroup();
        const circle = this.createCircle(x + 15, y + 25, 12, {
            fill: '#2C3E50', stroke: '#2C3E50'
        });
        group.appendChild(circle);
        return group;
    }

    drawEndState(x, y) {
        const group = this.createGroup();
        const outerCircle = this.createCircle(x + 15, y + 25, 15, {
            fill: '#fff', stroke: '#2C3E50', strokeWidth: 2
        });
        group.appendChild(outerCircle);
        const innerCircle = this.createCircle(x + 15, y + 25, 10, {
            fill: '#2C3E50', stroke: '#2C3E50'
        });
        group.appendChild(innerCircle);
        return group;
    }

    drawStateTransition(from, to, trans, cfg) {
        const group = this.createGroup();

        const isFromSpecial = trans.from === '__start__' || trans.from === '__end__';
        const isToSpecial = trans.to === '__start__' || trans.to === '__end__';

        const fromW = isFromSpecial ? 30 : cfg.stateWidth;
        const fromH = isFromSpecial ? 50 : cfg.stateHeight;
        const toW = isToSpecial ? 30 : cfg.stateWidth;
        const toH = isToSpecial ? 50 : cfg.stateHeight;

        const fromCx = from.x + fromW / 2;
        const fromCy = from.y + fromH / 2;
        const toCx = to.x + toW / 2;
        const toCy = to.y + toH / 2;

        let startX, startY, endX, endY;
        let pathD;

        // 수직 방향 (아래로)
        if (Math.abs(fromCy - toCy) > Math.abs(fromCx - toCx)) {
            if (fromCy < toCy) {
                startX = fromCx;
                startY = from.y + fromH;
                endX = toCx;
                endY = to.y;
            } else {
                startX = fromCx;
                startY = from.y;
                endX = toCx;
                endY = to.y + toH;
            }
            const midY = (startY + endY) / 2;
            pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
        }
        // 수평 방향 (같은 레벨)
        else {
            if (fromCx < toCx) {
                startX = from.x + fromW;
                startY = fromCy;
                endX = to.x;
                endY = toCy;
            } else {
                startX = from.x;
                startY = fromCy;
                endX = to.x + toW;
                endY = toCy;
            }
            const midX = (startX + endX) / 2;
            pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
        }

        const path = this.createPath(pathD, {
            markerEnd: 'url(#arrowhead)'
        });
        group.appendChild(path);

        // 라벨
        if (trans.label) {
            const labelX = (startX + endX) / 2;
            const labelY = (startY + endY) / 2;

            // 라벨 배경 크기 계산
            const labelWidth = Math.max(trans.label.length * 8 + 10, 50);

            const bg = this.createRect(labelX - labelWidth / 2, labelY - 10, labelWidth, 20, {
                fill: '#fff', stroke: '#ddd', rx: 3
            });
            group.appendChild(bg);

            const text = this.createText(labelX, labelY, trans.label, {
                fontSize: '11', fill: '#666'
            });
            group.appendChild(text);
        }

        return group;
    }

    // ===== Mindmap Renderer =====
    renderMindmap(data) {
        const cfg = this.config.mindmap;

        if (!data.root) {
            this.showError('마인드맵 루트 노드가 없습니다.');
            return;
        }

        // 노드 크기 및 위치 계산
        const layout = this.calculateMindmapLayout(data.root, cfg);

        const width = layout.totalWidth + cfg.padding * 2;
        const height = layout.totalHeight + cfg.padding * 2;

        const svg = this.createSvg(width, height);

        // 연결선 그리기
        this.drawMindmapConnections(svg, data.root, layout.positions, cfg);

        // 노드 그리기
        this.drawMindmapNodes(svg, data.root, layout.positions, cfg);

        this.container.appendChild(svg);
        return svg;
    }

    calculateMindmapLayout(root, cfg) {
        const positions = new Map();

        // 각 노드의 서브트리 높이 계산
        const calculateHeight = (node) => {
            if (!node.children || node.children.length === 0) {
                return cfg.nodeHeight + cfg.siblingSpacing;
            }
            let totalHeight = 0;
            node.children.forEach(child => {
                totalHeight += calculateHeight(child);
            });
            return Math.max(totalHeight, cfg.nodeHeight + cfg.siblingSpacing);
        };

        const totalHeight = calculateHeight(root);

        // 위치 할당
        const assignPositions = (node, level, startY, endY) => {
            const x = cfg.padding + level * cfg.levelSpacing;
            const y = (startY + endY) / 2;

            positions.set(node.id, { x, y, node });

            if (node.children && node.children.length > 0) {
                let childStartY = startY;
                node.children.forEach(child => {
                    const childHeight = calculateHeight(child);
                    assignPositions(child, level + 1, childStartY, childStartY + childHeight);
                    childStartY += childHeight;
                });
            }
        };

        assignPositions(root, 0, cfg.padding, totalHeight + cfg.padding);

        // 전체 너비 계산
        let maxX = 0;
        positions.forEach(pos => {
            const nodeWidth = Math.max(cfg.nodeMinWidth, pos.node.label.length * 10 + 30);
            maxX = Math.max(maxX, pos.x + nodeWidth);
        });

        return {
            positions,
            totalWidth: maxX,
            totalHeight
        };
    }

    drawMindmapConnections(svg, node, positions, cfg) {
        if (!node.children) return;

        const parentPos = positions.get(node.id);
        const parentWidth = Math.max(cfg.nodeMinWidth, node.label.length * 10 + 30);

        node.children.forEach(child => {
            const childPos = positions.get(child.id);

            if (parentPos && childPos) {
                const startX = parentPos.x + parentWidth;
                const startY = parentPos.y;
                const endX = childPos.x;
                const endY = childPos.y;

                const midX = (startX + endX) / 2;

                const path = this.createPath(
                    `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`,
                    { stroke: '#95A5A6', strokeWidth: 2 }
                );
                svg.appendChild(path);
            }

            this.drawMindmapConnections(svg, child, positions, cfg);
        });
    }

    drawMindmapNodes(svg, node, positions, cfg) {
        const pos = positions.get(node.id);
        if (!pos) return;

        const group = this.createGroup();
        const nodeWidth = Math.max(cfg.nodeMinWidth, node.label.length * 10 + 30);
        const nodeHeight = cfg.nodeHeight;

        const colors = {
            ellipse: { fill: '#E74C3C', stroke: '#C0392B' },
            circle: { fill: '#3498DB', stroke: '#2980B9' },
            rect: { fill: '#2ECC71', stroke: '#27AE60' },
            round: { fill: '#9B59B6', stroke: '#8E44AD' },
            default: { fill: '#F39C12', stroke: '#E67E22' },
            cloud: { fill: '#1ABC9C', stroke: '#16A085' },
            bang: { fill: '#E91E63', stroke: '#C2185B' }
        };

        const color = colors[node.shape] || colors.default;

        let shape;
        switch (node.shape) {
            case 'ellipse':
                shape = this.createEllipse(pos.x + nodeWidth / 2, pos.y, nodeWidth / 2, nodeHeight / 2, {
                    fill: color.fill, stroke: color.stroke, strokeWidth: 3
                });
                break;
            case 'circle':
                shape = this.createCircle(pos.x + nodeWidth / 2, pos.y, Math.min(nodeWidth, nodeHeight) / 2, {
                    fill: color.fill, stroke: color.stroke
                });
                break;
            case 'rect':
                shape = this.createRect(pos.x, pos.y - nodeHeight / 2, nodeWidth, nodeHeight, {
                    fill: color.fill, stroke: color.stroke, rx: 0, ry: 0
                });
                break;
            case 'cloud':
                // 간단한 클라우드 형태 (둥근 사각형으로 대체)
                shape = this.createRect(pos.x, pos.y - nodeHeight / 2, nodeWidth, nodeHeight, {
                    fill: color.fill, stroke: color.stroke, rx: 15, ry: 15
                });
                break;
            case 'round':
            default:
                shape = this.createRect(pos.x, pos.y - nodeHeight / 2, nodeWidth, nodeHeight, {
                    fill: color.fill, stroke: color.stroke, rx: 10, ry: 10, filter: 'url(#shadow)'
                });
        }

        group.appendChild(shape);

        const text = this.createText(pos.x + nodeWidth / 2, pos.y, node.label, {
            fill: '#fff', fontWeight: '500', fontSize: '13'
        });
        group.appendChild(text);

        svg.appendChild(group);

        // 자식 노드 그리기
        if (node.children) {
            node.children.forEach(child => {
                this.drawMindmapNodes(svg, child, positions, cfg);
            });
        }
    }

    // ===== Pie Chart Renderer =====
    renderPieChart(data) {
        const cfg = this.config.pie;
        const centerX = cfg.radius + cfg.padding;
        const centerY = cfg.radius + cfg.padding;
        const width = (cfg.radius + cfg.padding) * 2 + 200; // 범례 공간
        const height = (cfg.radius + cfg.padding) * 2;

        const svg = this.createSvg(width, height);

        // 타이틀
        if (data.title) {
            const title = this.createText(centerX, 25, data.title, {
                fontSize: '18', fontWeight: 'bold', fill: '#2C3E50'
            });
            svg.appendChild(title);
        }

        // 총합 계산
        const total = data.data.reduce((sum, d) => sum + d.value, 0);

        // 색상 팔레트
        const colors = ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E91E63', '#00BCD4', '#FF5722', '#795548'];

        let startAngle = -Math.PI / 2;

        data.data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;
            const color = colors[index % colors.length];

            // 파이 조각 그리기
            const slice = this.createPieSlice(centerX, centerY, cfg.radius, startAngle, endAngle, color);
            svg.appendChild(slice);

            // 값 표시 (showData인 경우)
            if (data.showData) {
                const midAngle = startAngle + sliceAngle / 2;
                const labelRadius = cfg.radius * 0.7;
                const labelX = centerX + Math.cos(midAngle) * labelRadius;
                const labelY = centerY + Math.sin(midAngle) * labelRadius;
                const percentage = ((item.value / total) * 100).toFixed(1) + '%';

                const label = this.createText(labelX, labelY, percentage, {
                    fontSize: '12', fontWeight: 'bold', fill: '#fff'
                });
                svg.appendChild(label);
            }

            startAngle = endAngle;
        });

        // 범례 그리기
        const legendX = centerX + cfg.radius + 40;
        let legendY = cfg.padding + 20;

        data.data.forEach((item, index) => {
            const color = colors[index % colors.length];

            // 색상 박스
            const colorBox = this.createRect(legendX, legendY - 8, 16, 16, {
                fill: color, stroke: 'none', rx: 2
            });
            svg.appendChild(colorBox);

            // 라벨
            const percentage = ((item.value / total) * 100).toFixed(1);
            const labelText = `${item.label} (${percentage}%)`;
            const label = this.createText(legendX + 24, legendY, labelText, {
                fontSize: '12', fill: '#2C3E50', anchor: 'start'
            });
            svg.appendChild(label);

            legendY += 25;
        });

        this.container.appendChild(svg);
        return svg;
    }

    createPieSlice(cx, cy, r, startAngle, endAngle, color) {
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        const d = [
            `M ${cx} ${cy}`,
            `L ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        const path = this.createPath(d, {
            fill: color,
            stroke: '#fff',
            strokeWidth: 2
        });

        return path;
    }

    // ===== Class Diagram Renderer =====
    renderClassDiagram(data) {
        const cfg = this.config.class;

        // 클래스 위치 계산
        const positions = new Map();
        const cols = Math.ceil(Math.sqrt(data.classes.length));

        data.classes.forEach((cls, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const classHeight = this.calculateClassHeight(cls);

            positions.set(cls.name, {
                x: cfg.padding + col * (cfg.classWidth + cfg.classSpacing),
                y: cfg.padding + row * (classHeight + cfg.classSpacing),
                width: cfg.classWidth,
                height: classHeight
            });
        });

        // 전체 크기 계산
        let maxX = 0, maxY = 0;
        positions.forEach(pos => {
            maxX = Math.max(maxX, pos.x + pos.width);
            maxY = Math.max(maxY, pos.y + pos.height);
        });

        const width = maxX + cfg.padding;
        const height = maxY + cfg.padding;

        const svg = this.createSvg(width, height);

        // 관계선 그리기
        data.relations.forEach(rel => {
            const fromPos = positions.get(rel.from);
            const toPos = positions.get(rel.to);
            if (fromPos && toPos) {
                const relationGroup = this.drawClassRelation(fromPos, toPos, rel);
                svg.appendChild(relationGroup);
            }
        });

        // 클래스 그리기
        data.classes.forEach(cls => {
            const pos = positions.get(cls.name);
            if (pos) {
                const classGroup = this.drawClass(cls, pos.x, pos.y, cfg);
                svg.appendChild(classGroup);
            }
        });

        this.container.appendChild(svg);
        return svg;
    }

    calculateClassHeight(cls) {
        const headerHeight = 35;
        const attrHeight = cls.attributes.length * 20;
        const methodHeight = cls.methods.length * 20;
        const minHeight = 80;

        return Math.max(minHeight, headerHeight + attrHeight + methodHeight + 20);
    }

    drawClass(cls, x, y, cfg) {
        const group = this.createGroup();
        const height = this.calculateClassHeight(cls);

        // 배경
        const bg = this.createRect(x, y, cfg.classWidth, height, {
            fill: '#fff', stroke: '#2C3E50', rx: 0, filter: 'url(#shadow)'
        });
        group.appendChild(bg);

        // 헤더 배경
        const headerBg = this.createRect(x, y, cfg.classWidth, 35, {
            fill: cls.stereotype ? '#E8F6F3' : '#EBF5FB', stroke: 'none', rx: 0
        });
        group.appendChild(headerBg);

        // 스테레오타입
        let headerY = y + 12;
        if (cls.stereotype) {
            const stereotype = this.createText(x + cfg.classWidth / 2, headerY, `<<${cls.stereotype}>>`, {
                fontSize: '10', fill: '#7F8C8D', fontStyle: 'italic'
            });
            group.appendChild(stereotype);
            headerY += 14;
        }

        // 클래스 이름
        const name = this.createText(x + cfg.classWidth / 2, cls.stereotype ? headerY : y + 20, cls.name, {
            fontSize: '14', fontWeight: 'bold', fill: '#2C3E50'
        });
        group.appendChild(name);

        // 구분선
        const line1 = this.createLine(x, y + 35, x + cfg.classWidth, y + 35, { stroke: '#2C3E50' });
        group.appendChild(line1);

        // 속성
        let attrY = y + 50;
        cls.attributes.forEach(attr => {
            const visibility = this.getVisibilitySymbol(attr.visibility);
            const attrText = this.createText(x + 10, attrY, `${visibility} ${attr.name}`, {
                fontSize: '12', fill: '#2C3E50', anchor: 'start'
            });
            group.appendChild(attrText);
            attrY += 20;
        });

        // 구분선 (속성과 메서드 사이)
        if (cls.attributes.length > 0 || cls.methods.length > 0) {
            const line2 = this.createLine(x, attrY - 5, x + cfg.classWidth, attrY - 5, { stroke: '#BDC3C7' });
            group.appendChild(line2);
        }

        // 메서드
        let methodY = attrY + 10;
        cls.methods.forEach(method => {
            const visibility = this.getVisibilitySymbol(method.visibility);
            const methodText = this.createText(x + 10, methodY, `${visibility} ${method.name}`, {
                fontSize: '12', fill: '#2C3E50', anchor: 'start'
            });
            group.appendChild(methodText);
            methodY += 20;
        });

        return group;
    }

    getVisibilitySymbol(v) {
        switch (v) {
            case '+': return '+';
            case '-': return '-';
            case '#': return '#';
            case '~': return '~';
            default: return '+';
        }
    }

    drawClassRelation(from, to, rel) {
        const group = this.createGroup();

        const fromCx = from.x + from.width / 2;
        const fromCy = from.y + from.height / 2;
        const toCx = to.x + to.width / 2;
        const toCy = to.y + to.height / 2;

        // 연결점 계산
        let startX, startY, endX, endY;

        if (Math.abs(fromCx - toCx) > Math.abs(fromCy - toCy)) {
            // 가로 연결
            if (fromCx < toCx) {
                startX = from.x + from.width;
                endX = to.x;
            } else {
                startX = from.x;
                endX = to.x + to.width;
            }
            startY = fromCy;
            endY = toCy;
        } else {
            // 세로 연결
            startX = fromCx;
            endX = toCx;
            if (fromCy < toCy) {
                startY = from.y + from.height;
                endY = to.y;
            } else {
                startY = from.y;
                endY = to.y + to.height;
            }
        }

        // 선 스타일
        let strokeDash = null;
        if (rel.type === 'dependency') strokeDash = '5,5';

        const line = this.createLine(startX, startY, endX, endY, {
            stroke: '#2C3E50',
            strokeWidth: 1.5,
            strokeDasharray: strokeDash
        });
        group.appendChild(line);

        // 화살표/마커 그리기
        const markerGroup = this.drawRelationMarker(endX, endY, startX, startY, rel.type);
        group.appendChild(markerGroup);

        // 라벨
        if (rel.label) {
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const label = this.createText(midX, midY - 8, rel.label, {
                fontSize: '10', fill: '#7F8C8D'
            });
            group.appendChild(label);
        }

        return group;
    }

    drawRelationMarker(x, y, fromX, fromY, type) {
        const group = this.createGroup();
        const angle = Math.atan2(y - fromY, x - fromX);
        const size = 12;

        const x1 = x - size * Math.cos(angle - Math.PI / 6);
        const y1 = y - size * Math.sin(angle - Math.PI / 6);
        const x2 = x - size * Math.cos(angle + Math.PI / 6);
        const y2 = y - size * Math.sin(angle + Math.PI / 6);

        if (type === 'inheritance') {
            // 빈 삼각형
            const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            triangle.setAttribute('points', `${x},${y} ${x1},${y1} ${x2},${y2}`);
            triangle.setAttribute('fill', '#fff');
            triangle.setAttribute('stroke', '#2C3E50');
            triangle.setAttribute('stroke-width', '1.5');
            group.appendChild(triangle);
        } else if (type === 'composition') {
            // 채워진 다이아몬드
            const mx = x - size * 0.7 * Math.cos(angle);
            const my = y - size * 0.7 * Math.sin(angle);
            const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            diamond.setAttribute('points', `${x},${y} ${x1},${y1} ${mx},${my} ${x2},${y2}`);
            diamond.setAttribute('fill', '#2C3E50');
            diamond.setAttribute('stroke', '#2C3E50');
            group.appendChild(diamond);
        } else if (type === 'aggregation') {
            // 빈 다이아몬드
            const mx = x - size * 0.7 * Math.cos(angle);
            const my = y - size * 0.7 * Math.sin(angle);
            const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            diamond.setAttribute('points', `${x},${y} ${x1},${y1} ${mx},${my} ${x2},${y2}`);
            diamond.setAttribute('fill', '#fff');
            diamond.setAttribute('stroke', '#2C3E50');
            diamond.setAttribute('stroke-width', '1.5');
            group.appendChild(diamond);
        } else {
            // 일반 화살표
            const arrow = this.createPath(`M ${x1} ${y1} L ${x} ${y} L ${x2} ${y2}`, {
                stroke: '#2C3E50',
                strokeWidth: 1.5,
                fill: 'none'
            });
            group.appendChild(arrow);
        }

        return group;
    }

    // ===== ER Diagram Renderer =====
    renderErDiagram(data) {
        const cfg = this.config.er;

        // 엔티티 위치 계산
        const positions = new Map();
        const cols = Math.ceil(Math.sqrt(data.entities.length));

        data.entities.forEach((entity, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const entityHeight = this.calculateEntityHeight(entity);

            positions.set(entity.name, {
                x: cfg.padding + col * (cfg.entityWidth + cfg.entitySpacing),
                y: cfg.padding + row * (entityHeight + cfg.entitySpacing),
                width: cfg.entityWidth,
                height: entityHeight
            });
        });

        // 전체 크기 계산
        let maxX = 0, maxY = 0;
        positions.forEach(pos => {
            maxX = Math.max(maxX, pos.x + pos.width);
            maxY = Math.max(maxY, pos.y + pos.height);
        });

        const width = maxX + cfg.padding;
        const height = maxY + cfg.padding;

        const svg = this.createSvg(width, height);

        // 관계선 그리기
        data.relations.forEach(rel => {
            const fromPos = positions.get(rel.from);
            const toPos = positions.get(rel.to);
            if (fromPos && toPos) {
                const relationGroup = this.drawErRelation(fromPos, toPos, rel);
                svg.appendChild(relationGroup);
            }
        });

        // 엔티티 그리기
        data.entities.forEach(entity => {
            const pos = positions.get(entity.name);
            if (pos) {
                const entityGroup = this.drawEntity(entity, pos.x, pos.y, cfg);
                svg.appendChild(entityGroup);
            }
        });

        this.container.appendChild(svg);
        return svg;
    }

    calculateEntityHeight(entity) {
        const headerHeight = 35;
        const attrHeight = entity.attributes.length * 22;
        const minHeight = 60;

        return Math.max(minHeight, headerHeight + attrHeight + 10);
    }

    drawEntity(entity, x, y, cfg) {
        const group = this.createGroup();
        const height = this.calculateEntityHeight(entity);

        // 배경
        const bg = this.createRect(x, y, cfg.entityWidth, height, {
            fill: '#fff', stroke: '#3498DB', strokeWidth: 2, rx: 4, filter: 'url(#shadow)'
        });
        group.appendChild(bg);

        // 헤더 배경
        const headerBg = this.createRect(x, y, cfg.entityWidth, 35, {
            fill: '#3498DB', stroke: 'none', rx: 4
        });
        group.appendChild(headerBg);

        // 하단 모서리 가리기
        const headerBg2 = this.createRect(x, y + 25, cfg.entityWidth, 10, {
            fill: '#3498DB', stroke: 'none', rx: 0
        });
        group.appendChild(headerBg2);

        // 엔티티 이름
        const name = this.createText(x + cfg.entityWidth / 2, y + 20, entity.name, {
            fontSize: '14', fontWeight: 'bold', fill: '#fff'
        });
        group.appendChild(name);

        // 속성
        let attrY = y + 50;
        entity.attributes.forEach(attr => {
            const keyIcon = attr.key === 'PK' ? 'PK ' : attr.key === 'FK' ? 'FK ' : attr.key === 'UK' ? 'UK ' : '';
            const attrText = `${keyIcon}${attr.type} ${attr.name}`;

            const text = this.createText(x + 10, attrY, attrText, {
                fontSize: '11', fill: attr.key ? '#E74C3C' : '#2C3E50', anchor: 'start'
            });
            group.appendChild(text);
            attrY += 22;
        });

        return group;
    }

    drawErRelation(from, to, rel) {
        const group = this.createGroup();

        const fromCx = from.x + from.width / 2;
        const fromCy = from.y + from.height / 2;
        const toCx = to.x + to.width / 2;
        const toCy = to.y + to.height / 2;

        // 연결점 계산
        let startX, startY, endX, endY;

        if (Math.abs(fromCx - toCx) > Math.abs(fromCy - toCy)) {
            if (fromCx < toCx) {
                startX = from.x + from.width;
                endX = to.x;
            } else {
                startX = from.x;
                endX = to.x + to.width;
            }
            startY = fromCy;
            endY = toCy;
        } else {
            startX = fromCx;
            endX = toCx;
            if (fromCy < toCy) {
                startY = from.y + from.height;
                endY = to.y;
            } else {
                startY = from.y;
                endY = to.y + to.height;
            }
        }

        // 선 그리기
        const line = this.createLine(startX, startY, endX, endY, {
            stroke: '#7F8C8D',
            strokeWidth: 1.5
        });
        group.appendChild(line);

        // 카디널리티 마커
        this.drawCardinalityMarker(group, startX, startY, endX, endY, rel.leftCardinality, true);
        this.drawCardinalityMarker(group, endX, endY, startX, startY, rel.rightCardinality, false);

        // 라벨
        if (rel.label) {
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            const labelBg = this.createRect(midX - 40, midY - 10, 80, 20, {
                fill: '#fff', stroke: 'none'
            });
            group.appendChild(labelBg);

            const label = this.createText(midX, midY + 4, rel.label, {
                fontSize: '11', fill: '#2C3E50'
            });
            group.appendChild(label);
        }

        return group;
    }

    drawCardinalityMarker(group, x, y, fromX, fromY, cardinality) {
        const angle = Math.atan2(y - fromY, x - fromX);
        const offset = 20;
        const markerX = x - offset * Math.cos(angle);
        const markerY = y - offset * Math.sin(angle);

        let symbol = '1';
        if (cardinality === 'many') symbol = '*';
        else if (cardinality === 'zero-or-one') symbol = '0..1';

        const text = this.createText(markerX, markerY - 8, symbol, {
            fontSize: '10', fill: '#7F8C8D'
        });
        group.appendChild(text);
    }

    // ===== Gantt Chart Renderer =====
    renderGantt(data) {
        const cfg = this.config.gantt;

        // 모든 태스크 수집
        const allTasks = [];
        data.sections.forEach(section => {
            if (section.name !== 'default' || section.tasks.length > 0) {
                allTasks.push(...section.tasks);
            }
        });

        // 날짜 범위 계산
        let minDate = new Date();
        let maxDate = new Date();

        allTasks.forEach((task, index) => {
            if (task.start) {
                const start = new Date(task.start);
                const end = task.end ? new Date(task.end) : new Date(start.getTime() + (task.duration || 1) * 24 * 60 * 60 * 1000);

                if (index === 0 || start < minDate) minDate = start;
                if (index === 0 || end > maxDate) maxDate = end;
            } else {
                // 기본 날짜 사용
                if (index === 0) {
                    minDate = new Date();
                    maxDate = new Date(minDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                }
            }
        });

        const totalDays = Math.ceil((maxDate - minDate) / (24 * 60 * 60 * 1000)) + 1;
        const chartWidth = cfg.labelWidth + totalDays * cfg.dayWidth;

        // 섹션별 행 수 계산
        let totalRows = 0;
        data.sections.forEach(section => {
            if (section.name !== 'default') totalRows++; // 섹션 헤더
            totalRows += section.tasks.length;
        });

        const height = cfg.padding * 2 + (data.title ? 40 : 0) + 30 + totalRows * cfg.rowHeight;
        const width = chartWidth + cfg.padding * 2;

        const svg = this.createSvg(width, height);

        let currentY = cfg.padding;

        // 타이틀
        if (data.title) {
            const title = this.createText(width / 2, currentY + 15, data.title, {
                fontSize: '18', fontWeight: 'bold', fill: '#2C3E50'
            });
            svg.appendChild(title);
            currentY += 40;
        }

        // 날짜 헤더
        const headerY = currentY;
        for (let i = 0; i <= totalDays; i++) {
            const date = new Date(minDate.getTime() + i * 24 * 60 * 60 * 1000);
            const x = cfg.padding + cfg.labelWidth + i * cfg.dayWidth;

            // 날짜 텍스트
            const dayText = this.createText(x + cfg.dayWidth / 2, headerY + 15, date.getDate().toString(), {
                fontSize: '10', fill: '#7F8C8D'
            });
            svg.appendChild(dayText);

            // 수직 그리드선
            const gridLine = this.createLine(x, headerY + 25, x, height - cfg.padding, {
                stroke: '#ECF0F1', strokeWidth: 1
            });
            svg.appendChild(gridLine);
        }
        currentY += 30;

        // 태스크 그리기
        data.sections.forEach(section => {
            // 섹션 헤더
            if (section.name !== 'default') {
                const sectionBg = this.createRect(cfg.padding, currentY, chartWidth, cfg.rowHeight, {
                    fill: '#F8F9FA', stroke: 'none'
                });
                svg.appendChild(sectionBg);

                const sectionText = this.createText(cfg.padding + 10, currentY + cfg.rowHeight / 2 + 4, section.name, {
                    fontSize: '12', fontWeight: 'bold', fill: '#2C3E50', anchor: 'start'
                });
                svg.appendChild(sectionText);
                currentY += cfg.rowHeight;
            }

            // 태스크들
            section.tasks.forEach(task => {
                // 태스크 라벨
                const label = this.createText(cfg.padding + 10, currentY + cfg.rowHeight / 2 + 4, task.name, {
                    fontSize: '11', fill: '#2C3E50', anchor: 'start'
                });
                svg.appendChild(label);

                // 태스크 바
                if (task.start) {
                    const startDate = new Date(task.start);
                    const duration = task.duration || 1;
                    const startOffset = Math.floor((startDate - minDate) / (24 * 60 * 60 * 1000));
                    const barX = cfg.padding + cfg.labelWidth + startOffset * cfg.dayWidth;
                    const barWidth = duration * cfg.dayWidth - 4;

                    let barColor = '#3498DB';
                    if (task.status === 'done') barColor = '#2ECC71';
                    else if (task.status === 'active') barColor = '#F39C12';
                    else if (task.status === 'crit') barColor = '#E74C3C';

                    const bar = this.createRect(barX + 2, currentY + 8, barWidth, cfg.rowHeight - 16, {
                        fill: barColor, stroke: 'none', rx: 3
                    });
                    svg.appendChild(bar);
                }

                currentY += cfg.rowHeight;
            });
        });

        this.container.appendChild(svg);
        return svg;
    }

    // ===== User Journey Renderer =====
    renderJourney(data) {
        const cfg = this.config.journey;

        // 모든 태스크 수집
        const allTasks = [];
        data.sections.forEach(section => {
            allTasks.push(...section.tasks);
        });

        const totalSteps = allTasks.length;
        const width = cfg.padding * 2 + totalSteps * cfg.stepWidth + 100;
        const height = cfg.padding * 2 + (data.title ? 50 : 0) + cfg.stepHeight + 150;

        const svg = this.createSvg(width, height);

        let currentY = cfg.padding;

        // 타이틀
        if (data.title) {
            const title = this.createText(width / 2, currentY + 20, data.title, {
                fontSize: '20', fontWeight: 'bold', fill: '#2C3E50'
            });
            svg.appendChild(title);
            currentY += 50;
        }

        // 감정선 그리기 (배경)
        const chartStartX = cfg.padding + 50;
        const chartEndX = chartStartX + totalSteps * cfg.stepWidth;
        const chartCenterY = currentY + cfg.stepHeight / 2;

        // 감정 레벨 가이드라인
        for (let i = 1; i <= 5; i++) {
            const y = chartCenterY + (3 - i) * 20;
            const line = this.createLine(chartStartX, y, chartEndX, y, {
                stroke: '#ECF0F1', strokeWidth: 1, strokeDasharray: '3,3'
            });
            svg.appendChild(line);

            // 점수 라벨
            const scoreLabel = this.createText(chartStartX - 15, y + 4, i.toString(), {
                fontSize: '10', fill: '#BDC3C7'
            });
            svg.appendChild(scoreLabel);
        }

        // 감정 라인 포인트 수집
        const points = [];
        let stepX = chartStartX + cfg.stepWidth / 2;

        allTasks.forEach((task, index) => {
            const scoreY = chartCenterY + (3 - task.score) * 20;
            points.push({ x: stepX, y: scoreY, task });
            stepX += cfg.stepWidth;
        });

        // 감정 라인 그리기
        if (points.length > 1) {
            let pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                const cp1x = (points[i - 1].x + points[i].x) / 2;
                pathD += ` C ${cp1x} ${points[i - 1].y}, ${cp1x} ${points[i].y}, ${points[i].x} ${points[i].y}`;
            }

            const emotionLine = this.createPath(pathD, {
                stroke: '#3498DB', strokeWidth: 3, fill: 'none'
            });
            svg.appendChild(emotionLine);
        }

        // 포인트 및 라벨 그리기
        points.forEach((point, index) => {
            // 포인트 색상 (점수에 따라)
            let pointColor = '#F39C12';
            if (point.task.score >= 4) pointColor = '#2ECC71';
            else if (point.task.score <= 2) pointColor = '#E74C3C';

            // 포인트
            const circle = this.createCircle(point.x, point.y, 8, {
                fill: pointColor, stroke: '#fff', strokeWidth: 2
            });
            svg.appendChild(circle);

            // 태스크 이름
            const label = this.createText(point.x, currentY + cfg.stepHeight + 30, point.task.name, {
                fontSize: '11', fill: '#2C3E50'
            });
            svg.appendChild(label);

            // 액터
            if (point.task.actors && point.task.actors.length > 0) {
                const actorText = this.createText(point.x, currentY + cfg.stepHeight + 48, point.task.actors.join(', '), {
                    fontSize: '9', fill: '#7F8C8D'
                });
                svg.appendChild(actorText);
            }
        });

        // 섹션 라벨
        let sectionX = chartStartX;
        data.sections.forEach(section => {
            if (section.name !== 'default' && section.tasks.length > 0) {
                const sectionWidth = section.tasks.length * cfg.stepWidth;
                const sectionLabel = this.createText(sectionX + sectionWidth / 2, currentY - 15, section.name, {
                    fontSize: '12', fontWeight: 'bold', fill: '#9B59B6'
                });
                svg.appendChild(sectionLabel);

                // 섹션 구분선
                const divider = this.createLine(sectionX + sectionWidth, currentY - 25, sectionX + sectionWidth, currentY + cfg.stepHeight + 60, {
                    stroke: '#ECF0F1', strokeWidth: 1, strokeDasharray: '5,5'
                });
                svg.appendChild(divider);

                sectionX += sectionWidth;
            }
        });

        this.container.appendChild(svg);
        return svg;
    }

    // ===== Wireframe Renderer =====
    renderWireframe(data) {
        const cfg = this.config.wireframe;
        const deviceSize = cfg[data.device] || cfg.mobile;

        const width = deviceSize.width;
        const height = deviceSize.height;

        const svg = this.createSvg(width, height);

        // 배경 (디바이스 프레임)
        const frame = this.createRect(0, 0, width, height, {
            fill: '#FFFFFF',
            stroke: '#E0E0E0',
            strokeWidth: 2,
            rx: data.device === 'mobile' ? 20 : 8
        });
        svg.appendChild(frame);

        // 현재 Y 위치 추적
        let currentY = 0;
        let sidebarWidth = 0;
        let hasSidebar = false;

        // sidebar가 있는지 확인
        data.elements.forEach(el => {
            if (el.type === 'sidebar') {
                hasSidebar = true;
                sidebarWidth = data.device === 'desktop' ? 220 : 200;
            }
        });

        const contentStartX = hasSidebar ? sidebarWidth : 0;
        const contentWidth = width - contentStartX;

        // 요소 렌더링
        data.elements.forEach(element => {
            const result = this.renderWireframeElement(svg, element, {
                x: contentStartX,
                y: currentY,
                width: contentWidth,
                height,
                device: data.device,
                cfg,
                sidebarWidth,
                fullWidth: width
            });
            if (result && result.height) {
                currentY += result.height;
            }
        });

        this.container.appendChild(svg);
        return svg;
    }

    renderWireframeElement(svg, element, ctx) {
        switch (element.type) {
            case 'statusbar':
                return this.renderWfStatusbar(svg, ctx);
            case 'header':
                return this.renderWfHeader(svg, element, ctx);
            case 'footer':
                return this.renderWfFooter(svg, element, ctx);
            case 'sidebar':
                return this.renderWfSidebar(svg, element, ctx);
            case 'section':
                return this.renderWfSection(svg, element, ctx);
            case 'bottomnav':
                return this.renderWfBottomNav(svg, element, ctx);
            case 'post':
                return this.renderWfPost(svg, element, ctx);
            default:
                return this.renderWfComponent(svg, element, ctx);
        }
    }

    renderWfStatusbar(svg, ctx) {
        const h = 24;
        const y = ctx.y;

        // 배경
        const bg = this.createRect(0, y, ctx.fullWidth, h, {
            fill: '#F5F5F5', stroke: 'none'
        });
        svg.appendChild(bg);

        // 시간
        const time = this.createText(ctx.fullWidth / 2, y + 16, '9:41', {
            fontSize: '12', fontWeight: 'bold', fill: '#000'
        });
        svg.appendChild(time);

        // 배터리 아이콘 (간단한 사각형)
        const battery = this.createRect(ctx.fullWidth - 35, y + 7, 22, 10, {
            fill: 'none', stroke: '#000', strokeWidth: 1, rx: 2
        });
        svg.appendChild(battery);
        const batteryFill = this.createRect(ctx.fullWidth - 33, y + 9, 16, 6, {
            fill: '#000', stroke: 'none', rx: 1
        });
        svg.appendChild(batteryFill);

        ctx.y += h;
        return { height: h };
    }

    renderWfHeader(svg, element, ctx) {
        const h = ctx.device === 'mobile' ? 56 : 64;
        const y = ctx.y;

        // 배경
        const bg = this.createRect(0, y, ctx.fullWidth, h, {
            fill: '#FAFAFA', stroke: 'none'
        });
        svg.appendChild(bg);

        // 하단 라인
        const line = this.createLine(0, y + h, ctx.fullWidth, y + h, {
            stroke: '#E0E0E0', strokeWidth: 1
        });
        svg.appendChild(line);

        let itemX = ctx.cfg.padding;
        const itemY = y + h / 2;

        // 헤더 아이템 렌더링
        element.items.forEach(item => {
            switch (item.type) {
                case 'logo':
                    const logo = this.createText(itemX + 10, itemY + 5, item.text, {
                        fontSize: '18', fontWeight: 'bold', fill: '#333', anchor: 'start'
                    });
                    svg.appendChild(logo);
                    itemX += item.text.length * 12 + 20;
                    break;
                case 'nav':
                    if (ctx.device !== 'mobile') {
                        item.items.forEach((navItem, idx) => {
                            const navText = this.createText(itemX + 10, itemY + 5, navItem, {
                                fontSize: '13', fill: '#666', anchor: 'start'
                            });
                            svg.appendChild(navText);
                            itemX += navItem.length * 8 + 25;
                        });
                    }
                    break;
                case 'search':
                    const searchWidth = ctx.device === 'mobile' ? 150 : 200;
                    const searchBox = this.createRect(ctx.fullWidth - searchWidth - ctx.cfg.padding - 50, itemY - 15, searchWidth, 30, {
                        fill: '#FFF', stroke: '#DDD', rx: 4
                    });
                    svg.appendChild(searchBox);
                    const searchText = this.createText(ctx.fullWidth - searchWidth - ctx.cfg.padding - 35, itemY + 4, item.placeholder, {
                        fontSize: '12', fill: '#999', anchor: 'start'
                    });
                    svg.appendChild(searchText);
                    break;
                case 'icon':
                    const iconX = ctx.fullWidth - ctx.cfg.padding - 20;
                    this.renderWfIcon(svg, item.name, iconX, itemY - 10, 20);
                    break;
                case 'avatar':
                    const avatarX = ctx.fullWidth - ctx.cfg.padding - 20;
                    const avatarCircle = this.createCircle(avatarX, itemY, 16, {
                        fill: '#E0E0E0', stroke: '#CCC'
                    });
                    svg.appendChild(avatarCircle);
                    break;
            }
        });

        ctx.y += h;
        return { height: h };
    }

    renderWfFooter(svg, element, ctx) {
        const h = 60;
        const y = ctx.height - h;

        // 배경
        const bg = this.createRect(0, y, ctx.fullWidth, h, {
            fill: '#FAFAFA', stroke: 'none'
        });
        svg.appendChild(bg);

        // 상단 라인
        const line = this.createLine(0, y, ctx.fullWidth, y, {
            stroke: '#E0E0E0', strokeWidth: 1
        });
        svg.appendChild(line);

        // 아이템 렌더링 (중앙 정렬)
        const totalItems = element.items.length;
        const spacing = ctx.fullWidth / (totalItems + 1);

        element.items.forEach((item, idx) => {
            const itemX = spacing * (idx + 1);
            const itemY = y + h / 2;

            if (item.type === 'link') {
                const linkText = this.createText(itemX, itemY + 4, item.text, {
                    fontSize: '12', fill: '#666'
                });
                svg.appendChild(linkText);
            } else if (item.type === 'text') {
                const text = this.createText(itemX, itemY + 4, item.content, {
                    fontSize: '11', fill: '#999'
                });
                svg.appendChild(text);
            }
        });

        return { height: 0 }; // footer는 하단에 고정
    }

    renderWfSidebar(svg, element, ctx) {
        const sidebarW = ctx.sidebarWidth;
        const sidebarH = ctx.height;

        // 배경
        const bg = this.createRect(0, 0, sidebarW, sidebarH, {
            fill: '#2C3E50', stroke: 'none'
        });
        svg.appendChild(bg);

        let itemY = 80;

        element.items.forEach(item => {
            if (item.type === 'menu') {
                const itemBg = this.createRect(0, itemY - 15, sidebarW, 40, {
                    fill: item.active ? 'rgba(255,255,255,0.1)' : 'transparent', stroke: 'none'
                });
                svg.appendChild(itemBg);

                const menuText = this.createText(20, itemY + 5, item.label, {
                    fontSize: '13', fill: item.active ? '#FFF' : '#AAA', anchor: 'start'
                });
                svg.appendChild(menuText);

                if (item.active) {
                    const indicator = this.createRect(0, itemY - 15, 4, 40, {
                        fill: '#3498DB', stroke: 'none'
                    });
                    svg.appendChild(indicator);
                }

                itemY += 45;
            } else if (item.type === 'divider') {
                const divLine = this.createLine(20, itemY, sidebarW - 20, itemY, {
                    stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1
                });
                svg.appendChild(divLine);
                itemY += 20;
            }
        });

        return { height: 0 };
    }

    renderWfSection(svg, element, ctx) {
        const padding = ctx.cfg.padding;
        const startY = ctx.y + padding;
        let currentY = startY;

        // 섹션 제목
        const title = this.createText(ctx.x + padding, currentY + 16, element.title, {
            fontSize: '16', fontWeight: 'bold', fill: '#333', anchor: 'start'
        });
        svg.appendChild(title);
        currentY += 35;

        // 섹션 아이템 렌더링
        element.items.forEach(item => {
            const result = this.renderWfSectionItem(svg, item, {
                ...ctx,
                x: ctx.x + padding,
                y: currentY,
                width: ctx.width - padding * 2
            });
            currentY += result.height + ctx.cfg.componentSpacing;
        });

        return { height: currentY - ctx.y + padding };
    }

    renderWfSectionItem(svg, item, ctx) {
        switch (item.type) {
            case 'text':
                const text = this.createText(ctx.x, ctx.y + 14, item.content, {
                    fontSize: '14', fill: '#333', anchor: 'start'
                });
                svg.appendChild(text);
                return { height: 24 };

            case 'input':
                const inputH = 44;
                const inputBg = this.createRect(ctx.x, ctx.y, ctx.width, inputH, {
                    fill: '#FFF', stroke: '#DDD', rx: 6
                });
                svg.appendChild(inputBg);
                const inputText = this.createText(ctx.x + 12, ctx.y + inputH / 2 + 4, item.placeholder, {
                    fontSize: '13', fill: '#999', anchor: 'start'
                });
                svg.appendChild(inputText);
                return { height: inputH };

            case 'button':
                const btnH = 44;
                const btnBg = this.createRect(ctx.x, ctx.y, ctx.width, btnH, {
                    fill: item.variant === 'primary' ? '#3498DB' : '#F5F5F5',
                    stroke: item.variant === 'primary' ? 'none' : '#DDD',
                    rx: 6
                });
                svg.appendChild(btnBg);
                const btnText = this.createText(ctx.x + ctx.width / 2, ctx.y + btnH / 2 + 5, item.label, {
                    fontSize: '14', fontWeight: '600', fill: item.variant === 'primary' ? '#FFF' : '#333'
                });
                svg.appendChild(btnText);
                return { height: btnH };

            case 'checkbox':
                const cbSize = 20;
                const cbBox = this.createRect(ctx.x, ctx.y + 2, cbSize, cbSize, {
                    fill: '#FFF', stroke: '#DDD', rx: 4
                });
                svg.appendChild(cbBox);
                const cbLabel = this.createText(ctx.x + cbSize + 10, ctx.y + 16, item.label, {
                    fontSize: '13', fill: '#333', anchor: 'start'
                });
                svg.appendChild(cbLabel);
                return { height: 28 };

            case 'link':
                const linkText = this.createText(ctx.x + ctx.width / 2, ctx.y + 14, item.text, {
                    fontSize: '13', fill: '#3498DB'
                });
                svg.appendChild(linkText);
                return { height: 24 };

            case 'divider':
                if (item.text) {
                    const divLine1 = this.createLine(ctx.x, ctx.y + 12, ctx.x + ctx.width / 2 - 30, ctx.y + 12, {
                        stroke: '#E0E0E0', strokeWidth: 1
                    });
                    svg.appendChild(divLine1);
                    const divText = this.createText(ctx.x + ctx.width / 2, ctx.y + 16, item.text, {
                        fontSize: '12', fill: '#999'
                    });
                    svg.appendChild(divText);
                    const divLine2 = this.createLine(ctx.x + ctx.width / 2 + 30, ctx.y + 12, ctx.x + ctx.width, ctx.y + 12, {
                        stroke: '#E0E0E0', strokeWidth: 1
                    });
                    svg.appendChild(divLine2);
                } else {
                    const divLine = this.createLine(ctx.x, ctx.y + 12, ctx.x + ctx.width, ctx.y + 12, {
                        stroke: '#E0E0E0', strokeWidth: 1
                    });
                    svg.appendChild(divLine);
                }
                return { height: 24 };

            case 'dropdown':
                const ddH = 44;
                const ddBg = this.createRect(ctx.x, ctx.y, ctx.width, ddH, {
                    fill: '#FFF', stroke: '#DDD', rx: 6
                });
                svg.appendChild(ddBg);
                const ddText = this.createText(ctx.x + 12, ctx.y + ddH / 2 + 4, item.label, {
                    fontSize: '13', fill: '#333', anchor: 'start'
                });
                svg.appendChild(ddText);
                // 드롭다운 화살표
                const arrowPath = this.createPath(`M ${ctx.x + ctx.width - 20} ${ctx.y + ddH / 2 - 3} l 6 6 l 6 -6`, {
                    stroke: '#666', strokeWidth: 2, fill: 'none'
                });
                svg.appendChild(arrowPath);
                return { height: ddH };

            case 'card':
                const cardH = 80;
                const cardBg = this.createRect(ctx.x, ctx.y, ctx.width / 2 - 8, cardH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(cardBg);
                const cardTitle = this.createText(ctx.x + 12, ctx.y + 25, item.title, {
                    fontSize: '11', fill: '#666', anchor: 'start'
                });
                svg.appendChild(cardTitle);
                const cardValue = this.createText(ctx.x + 12, ctx.y + 50, item.value, {
                    fontSize: '18', fontWeight: 'bold', fill: '#333', anchor: 'start'
                });
                svg.appendChild(cardValue);
                if (item.change) {
                    const isPositive = item.change.startsWith('+');
                    const changeText = this.createText(ctx.x + 12, ctx.y + 68, item.change, {
                        fontSize: '11', fill: isPositive ? '#2ECC71' : '#E74C3C', anchor: 'start'
                    });
                    svg.appendChild(changeText);
                }
                return { height: cardH };

            case 'chart':
                const chartH = 150;
                const chartBg = this.createRect(ctx.x, ctx.y, ctx.width, chartH, {
                    fill: '#FAFAFA', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(chartBg);
                const chartTitle = this.createText(ctx.x + ctx.width / 2, ctx.y + 20, item.title, {
                    fontSize: '12', fill: '#666'
                });
                svg.appendChild(chartTitle);
                // 차트 placeholder
                if (item.chartType === 'bar') {
                    for (let i = 0; i < 5; i++) {
                        const barH = 30 + Math.random() * 60;
                        const bar = this.createRect(ctx.x + 30 + i * 40, ctx.y + chartH - 30 - barH, 25, barH, {
                            fill: '#3498DB', stroke: 'none', rx: 2
                        });
                        svg.appendChild(bar);
                    }
                } else if (item.chartType === 'line') {
                    const points = [];
                    for (let i = 0; i < 6; i++) {
                        points.push(`${ctx.x + 30 + i * 35},${ctx.y + 60 + Math.random() * 50}`);
                    }
                    const linePath = this.createPath(`M ${points.join(' L ')}`, {
                        stroke: '#3498DB', strokeWidth: 2, fill: 'none'
                    });
                    svg.appendChild(linePath);
                }
                return { height: chartH };

            case 'table':
                const tableH = 120;
                const tableBg = this.createRect(ctx.x, ctx.y, ctx.width, tableH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 4
                });
                svg.appendChild(tableBg);
                // 헤더
                const headerBg = this.createRect(ctx.x, ctx.y, ctx.width, 35, {
                    fill: '#F5F5F5', stroke: 'none', rx: 4
                });
                svg.appendChild(headerBg);
                const colWidth = ctx.width / item.columns.length;
                item.columns.forEach((col, idx) => {
                    const colText = this.createText(ctx.x + colWidth * idx + colWidth / 2, ctx.y + 22, col, {
                        fontSize: '12', fontWeight: 'bold', fill: '#333'
                    });
                    svg.appendChild(colText);
                });
                // 행 라인
                for (let i = 1; i <= 2; i++) {
                    const rowLine = this.createLine(ctx.x, ctx.y + 35 + i * 28, ctx.x + ctx.width, ctx.y + 35 + i * 28, {
                        stroke: '#E0E0E0', strokeWidth: 1
                    });
                    svg.appendChild(rowLine);
                    // placeholder 데이터
                    item.columns.forEach((col, idx) => {
                        const dataRect = this.createRect(ctx.x + colWidth * idx + 10, ctx.y + 35 + (i - 1) * 28 + 8, colWidth - 20, 12, {
                            fill: '#EEE', stroke: 'none', rx: 2
                        });
                        svg.appendChild(dataRect);
                    });
                }
                return { height: tableH };

            case 'product':
                const prodW = (ctx.width - 16) / 2;
                const prodH = 180;
                const prodBg = this.createRect(ctx.x, ctx.y, prodW, prodH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(prodBg);
                // 이미지 placeholder
                const imgBg = this.createRect(ctx.x + 8, ctx.y + 8, prodW - 16, 100, {
                    fill: '#F0F0F0', stroke: 'none', rx: 4
                });
                svg.appendChild(imgBg);
                // 상품명
                const prodName = this.createText(ctx.x + prodW / 2, ctx.y + 130, item.name, {
                    fontSize: '12', fill: '#333'
                });
                svg.appendChild(prodName);
                // 가격
                const prodPrice = this.createText(ctx.x + prodW / 2, ctx.y + 150, item.price, {
                    fontSize: '14', fontWeight: 'bold', fill: '#E74C3C'
                });
                svg.appendChild(prodPrice);
                // 별점
                if (item.rating) {
                    const starText = this.createText(ctx.x + prodW / 2, ctx.y + 168, '★ ' + item.rating, {
                        fontSize: '11', fill: '#F39C12'
                    });
                    svg.appendChild(starText);
                }
                return { height: prodH };

            case 'avatar':
                const avatarCircle = this.createCircle(ctx.x + 25, ctx.y + 25, 22, {
                    fill: '#E0E0E0', stroke: item.add ? '#3498DB' : '#CCC', strokeWidth: item.add ? 2 : 1
                });
                svg.appendChild(avatarCircle);
                if (item.add) {
                    const plusLine1 = this.createLine(ctx.x + 25 - 8, ctx.y + 25, ctx.x + 25 + 8, ctx.y + 25, {
                        stroke: '#3498DB', strokeWidth: 2
                    });
                    svg.appendChild(plusLine1);
                    const plusLine2 = this.createLine(ctx.x + 25, ctx.y + 25 - 8, ctx.x + 25, ctx.y + 25 + 8, {
                        stroke: '#3498DB', strokeWidth: 2
                    });
                    svg.appendChild(plusLine2);
                }
                const avatarName = this.createText(ctx.x + 25, ctx.y + 58, item.name.substring(0, 6), {
                    fontSize: '10', fill: '#666'
                });
                svg.appendChild(avatarName);
                return { height: 65 };

            case 'image':
                const imgH = 200;
                const placeholderBg = this.createRect(ctx.x, ctx.y, ctx.width, imgH, {
                    fill: '#F0F0F0', stroke: '#E0E0E0', rx: 0
                });
                svg.appendChild(placeholderBg);
                // 이미지 아이콘
                const imgIcon = this.createPath(`M ${ctx.x + ctx.width / 2 - 20} ${ctx.y + imgH / 2 - 10} l 10 15 l 10 -8 l 15 20 h -50 z`, {
                    fill: '#CCC', stroke: 'none'
                });
                svg.appendChild(imgIcon);
                return { height: imgH };

            case 'icons':
                const iconsY = ctx.y + 10;
                const iconSpacing = ctx.width / (item.names.length + 1);
                item.names.forEach((name, idx) => {
                    this.renderWfIcon(svg, name, ctx.x + iconSpacing * (idx + 1) - 12, iconsY, 24);
                });
                return { height: 44 };

            case 'post':
                return this.renderWfPost(svg, item, ctx);

            case 'radio':
                const radioSize = 20;
                const radioCircle = this.createCircle(ctx.x + radioSize / 2, ctx.y + radioSize / 2 + 2, radioSize / 2, {
                    fill: '#FFF', stroke: item.checked ? '#3498DB' : '#DDD', strokeWidth: 2
                });
                svg.appendChild(radioCircle);
                if (item.checked) {
                    const innerCircle = this.createCircle(ctx.x + radioSize / 2, ctx.y + radioSize / 2 + 2, 6, {
                        fill: '#3498DB', stroke: 'none'
                    });
                    svg.appendChild(innerCircle);
                }
                const radioLabel = this.createText(ctx.x + radioSize + 10, ctx.y + 16, item.label, {
                    fontSize: '13', fill: '#333', anchor: 'start'
                });
                svg.appendChild(radioLabel);
                return { height: 28 };

            case 'toggle':
                const toggleW = 50;
                const toggleH = 26;
                const toggleBg = this.createRect(ctx.x, ctx.y, toggleW, toggleH, {
                    fill: item.on ? '#3498DB' : '#DDD', stroke: 'none', rx: toggleH / 2
                });
                svg.appendChild(toggleBg);
                const knobX = item.on ? ctx.x + toggleW - toggleH + 3 : ctx.x + 3;
                const knob = this.createCircle(knobX + 10, ctx.y + toggleH / 2, 10, {
                    fill: '#FFF', stroke: 'none'
                });
                svg.appendChild(knob);
                const toggleLabel = this.createText(ctx.x + toggleW + 12, ctx.y + 18, item.label, {
                    fontSize: '13', fill: '#333', anchor: 'start'
                });
                svg.appendChild(toggleLabel);
                return { height: 32 };

            case 'badge':
                const badgeColors = {
                    red: '#E74C3C', green: '#2ECC71', blue: '#3498DB',
                    yellow: '#F39C12', gray: '#95A5A6'
                };
                const badgeW = Math.max(item.text.length * 8 + 16, 30);
                const badgeH = 22;
                const badgeBg = this.createRect(ctx.x, ctx.y, badgeW, badgeH, {
                    fill: badgeColors[item.color] || badgeColors.blue, stroke: 'none', rx: badgeH / 2
                });
                svg.appendChild(badgeBg);
                const badgeText = this.createText(ctx.x + badgeW / 2, ctx.y + 15, item.text, {
                    fontSize: '11', fill: '#FFF', fontWeight: 'bold'
                });
                svg.appendChild(badgeText);
                return { height: 28 };

            case 'tabs':
                const tabsH = 44;
                const tabW = ctx.width / item.items.length;
                const tabsBg = this.createRect(ctx.x, ctx.y, ctx.width, tabsH, {
                    fill: '#F5F5F5', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(tabsBg);
                item.items.forEach((tab, idx) => {
                    const isActive = idx === item.activeIndex;
                    if (isActive) {
                        const activeTab = this.createRect(ctx.x + tabW * idx + 4, ctx.y + 4, tabW - 8, tabsH - 8, {
                            fill: '#FFF', stroke: 'none', rx: 6
                        });
                        svg.appendChild(activeTab);
                    }
                    const tabText = this.createText(ctx.x + tabW * idx + tabW / 2, ctx.y + tabsH / 2 + 5, tab, {
                        fontSize: '13', fill: isActive ? '#333' : '#666', fontWeight: isActive ? '600' : '400'
                    });
                    svg.appendChild(tabText);
                });
                return { height: tabsH + 8 };

            case 'breadcrumb':
                let bcX = ctx.x;
                item.items.forEach((crumb, idx) => {
                    const crumbText = this.createText(bcX, ctx.y + 14, crumb, {
                        fontSize: '12', fill: idx === item.items.length - 1 ? '#333' : '#3498DB', anchor: 'start'
                    });
                    svg.appendChild(crumbText);
                    bcX += crumb.length * 7 + 8;
                    if (idx < item.items.length - 1) {
                        const sep = this.createText(bcX, ctx.y + 14, '/', {
                            fontSize: '12', fill: '#999', anchor: 'start'
                        });
                        svg.appendChild(sep);
                        bcX += 12;
                    }
                });
                return { height: 28 };

            case 'progress':
                const progH = 8;
                const progBg = this.createRect(ctx.x, ctx.y + 8, ctx.width, progH, {
                    fill: '#E0E0E0', stroke: 'none', rx: progH / 2
                });
                svg.appendChild(progBg);
                const progFill = this.createRect(ctx.x, ctx.y + 8, ctx.width * (item.value / 100), progH, {
                    fill: '#3498DB', stroke: 'none', rx: progH / 2
                });
                svg.appendChild(progFill);
                if (item.label) {
                    const progLabel = this.createText(ctx.x, ctx.y + 32, item.label, {
                        fontSize: '12', fill: '#666', anchor: 'start'
                    });
                    svg.appendChild(progLabel);
                    const progVal = this.createText(ctx.x + ctx.width, ctx.y + 32, item.value + '%', {
                        fontSize: '12', fill: '#333', anchor: 'end'
                    });
                    svg.appendChild(progVal);
                    return { height: 40 };
                }
                return { height: 24 };

            case 'rating':
                const starSize = 20;
                for (let i = 0; i < 5; i++) {
                    const filled = i < Math.floor(item.value);
                    const half = i === Math.floor(item.value) && item.value % 1 >= 0.5;
                    const star = this.createText(ctx.x + i * (starSize + 4), ctx.y + 16, '★', {
                        fontSize: '18', fill: filled || half ? '#F39C12' : '#DDD', anchor: 'start'
                    });
                    svg.appendChild(star);
                }
                const ratingVal = this.createText(ctx.x + 5 * (starSize + 4) + 8, ctx.y + 16, item.value.toFixed(1), {
                    fontSize: '14', fill: '#666', anchor: 'start'
                });
                svg.appendChild(ratingVal);
                return { height: 28 };

            case 'stepper':
                const stepH = 60;
                const stepW = ctx.width / item.steps.length;
                item.steps.forEach((step, idx) => {
                    const stepX = ctx.x + stepW * idx + stepW / 2;
                    const isActive = idx + 1 === item.active;
                    const isPast = idx + 1 < item.active;
                    const circleColor = isPast || isActive ? '#3498DB' : '#DDD';
                    const stepCircle = this.createCircle(stepX, ctx.y + 15, 15, {
                        fill: isPast || isActive ? circleColor : '#FFF',
                        stroke: circleColor, strokeWidth: 2
                    });
                    svg.appendChild(stepCircle);
                    const stepNum = this.createText(stepX, ctx.y + 20, isPast ? '✓' : (idx + 1).toString(), {
                        fontSize: '12', fill: isPast || isActive ? '#FFF' : '#999', fontWeight: 'bold'
                    });
                    svg.appendChild(stepNum);
                    const stepLabel = this.createText(stepX, ctx.y + 45, step, {
                        fontSize: '11', fill: isActive ? '#333' : '#666'
                    });
                    svg.appendChild(stepLabel);
                    if (idx < item.steps.length - 1) {
                        const lineX = stepX + 20;
                        const lineColor = idx + 1 < item.active ? '#3498DB' : '#DDD';
                        const stepLine = this.createLine(lineX, ctx.y + 15, ctx.x + stepW * (idx + 1) + stepW / 2 - 20, ctx.y + 15, {
                            stroke: lineColor, strokeWidth: 2
                        });
                        svg.appendChild(stepLine);
                    }
                });
                return { height: stepH };

            case 'list':
                let listY = ctx.y;
                const listItemH = 28;
                item.items.forEach((listItem, idx) => {
                    let marker;
                    if (item.listType === 'bullet') {
                        marker = '•';
                    } else if (item.listType === 'number') {
                        marker = (idx + 1) + '.';
                    } else {
                        marker = '☑';
                    }
                    const markerText = this.createText(ctx.x, listY + 16, marker, {
                        fontSize: '14', fill: item.listType === 'check' ? '#2ECC71' : '#666', anchor: 'start'
                    });
                    svg.appendChild(markerText);
                    const listText = this.createText(ctx.x + 20, listY + 16, listItem, {
                        fontSize: '13', fill: '#333', anchor: 'start'
                    });
                    svg.appendChild(listText);
                    listY += listItemH;
                });
                return { height: item.items.length * listItemH };

            case 'alert':
                const alertH = 48;
                const alertColors = {
                    info: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0', icon: 'ⓘ' },
                    success: { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32', icon: '✓' },
                    warning: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100', icon: '⚠' },
                    error: { bg: '#FFEBEE', border: '#F44336', text: '#C62828', icon: '✕' }
                };
                const alertStyle = alertColors[item.alertType] || alertColors.info;
                const alertBg = this.createRect(ctx.x, ctx.y, ctx.width, alertH, {
                    fill: alertStyle.bg, stroke: alertStyle.border, rx: 6
                });
                svg.appendChild(alertBg);
                const alertIcon = this.createText(ctx.x + 16, ctx.y + alertH / 2 + 5, alertStyle.icon, {
                    fontSize: '16', fill: alertStyle.text, anchor: 'start'
                });
                svg.appendChild(alertIcon);
                const alertText = this.createText(ctx.x + 40, ctx.y + alertH / 2 + 5, item.message, {
                    fontSize: '13', fill: alertStyle.text, anchor: 'start'
                });
                svg.appendChild(alertText);
                return { height: alertH + 8 };

            case 'tag':
                const tagColors = {
                    red: { bg: '#FFEBEE', text: '#C62828' },
                    green: { bg: '#E8F5E9', text: '#2E7D32' },
                    blue: { bg: '#E3F2FD', text: '#1565C0' },
                    yellow: { bg: '#FFF8E1', text: '#F57F17' },
                    gray: { bg: '#F5F5F5', text: '#616161' },
                    purple: { bg: '#F3E5F5', text: '#6A1B9A' }
                };
                const tagStyle = tagColors[item.color] || tagColors.gray;
                const tagW = item.text.length * 8 + 20;
                const tagH = 26;
                const tagBg = this.createRect(ctx.x, ctx.y, tagW, tagH, {
                    fill: tagStyle.bg, stroke: 'none', rx: 4
                });
                svg.appendChild(tagBg);
                const tagText = this.createText(ctx.x + tagW / 2, ctx.y + 17, item.text, {
                    fontSize: '12', fill: tagStyle.text
                });
                svg.appendChild(tagText);
                return { height: tagH + 8 };

            case 'slider':
                const sliderH = 6;
                const sliderBg = this.createRect(ctx.x, ctx.y + 10, ctx.width, sliderH, {
                    fill: '#E0E0E0', stroke: 'none', rx: sliderH / 2
                });
                svg.appendChild(sliderBg);
                const sliderFill = this.createRect(ctx.x, ctx.y + 10, ctx.width * (item.value / 100), sliderH, {
                    fill: '#3498DB', stroke: 'none', rx: sliderH / 2
                });
                svg.appendChild(sliderFill);
                const sliderKnob = this.createCircle(ctx.x + ctx.width * (item.value / 100), ctx.y + 13, 10, {
                    fill: '#3498DB', stroke: '#FFF', strokeWidth: 2
                });
                svg.appendChild(sliderKnob);
                if (item.label) {
                    const sliderLabel = this.createText(ctx.x, ctx.y + 40, item.label, {
                        fontSize: '12', fill: '#666', anchor: 'start'
                    });
                    svg.appendChild(sliderLabel);
                    return { height: 48 };
                }
                return { height: 32 };

            case 'spacer':
                return { height: item.size };

            case 'heading':
                const headingSizes = { 1: '24', 2: '20', 3: '16', 4: '14' };
                const headingText = this.createText(ctx.x, ctx.y + parseInt(headingSizes[item.level] || '16'), item.text, {
                    fontSize: headingSizes[item.level] || '16', fontWeight: 'bold', fill: '#333', anchor: 'start'
                });
                svg.appendChild(headingText);
                return { height: parseInt(headingSizes[item.level] || '16') + 12 };

            case 'paragraph':
                const paraText = this.createText(ctx.x, ctx.y + 14, item.text, {
                    fontSize: '13', fill: '#666', anchor: 'start'
                });
                svg.appendChild(paraText);
                return { height: 24 };

            case 'quote':
                const quoteH = 60;
                const quoteBg = this.createRect(ctx.x, ctx.y, ctx.width, quoteH, {
                    fill: '#F9F9F9', stroke: 'none', rx: 4
                });
                svg.appendChild(quoteBg);
                const quoteLine = this.createRect(ctx.x, ctx.y, 4, quoteH, {
                    fill: '#3498DB', stroke: 'none', rx: 2
                });
                svg.appendChild(quoteLine);
                const quoteText = this.createText(ctx.x + 16, ctx.y + 25, '"' + item.text + '"', {
                    fontSize: '13', fill: '#555', anchor: 'start', fontStyle: 'italic'
                });
                svg.appendChild(quoteText);
                if (item.author) {
                    const quoteAuthor = this.createText(ctx.x + 16, ctx.y + 45, '— ' + item.author, {
                        fontSize: '12', fill: '#999', anchor: 'start'
                    });
                    svg.appendChild(quoteAuthor);
                }
                return { height: quoteH + 8 };

            case 'video':
                const videoH = 180;
                const videoBg = this.createRect(ctx.x, ctx.y, ctx.width, videoH, {
                    fill: '#1A1A1A', stroke: 'none', rx: 8
                });
                svg.appendChild(videoBg);
                const playCircle = this.createCircle(ctx.x + ctx.width / 2, ctx.y + videoH / 2, 30, {
                    fill: 'rgba(255,255,255,0.9)', stroke: 'none'
                });
                svg.appendChild(playCircle);
                const playIcon = this.createPath(`M ${ctx.x + ctx.width / 2 - 8} ${ctx.y + videoH / 2 - 12} l 24 12 l -24 12 z`, {
                    fill: '#1A1A1A', stroke: 'none'
                });
                svg.appendChild(playIcon);
                return { height: videoH + 8 };

            case 'map':
                const mapH = 180;
                const mapBg = this.createRect(ctx.x, ctx.y, ctx.width, mapH, {
                    fill: '#E8F4E8', stroke: '#CCC', rx: 8
                });
                svg.appendChild(mapBg);
                for (let i = 0; i < 5; i++) {
                    const roadLine = this.createLine(
                        ctx.x + Math.random() * ctx.width * 0.3, ctx.y + Math.random() * mapH,
                        ctx.x + ctx.width * 0.7 + Math.random() * ctx.width * 0.3, ctx.y + Math.random() * mapH,
                        { stroke: '#FFF', strokeWidth: 2 }
                    );
                    svg.appendChild(roadLine);
                }
                const pinX = ctx.x + ctx.width / 2;
                const pinY = ctx.y + mapH / 2;
                const pin = this.createPath(`M ${pinX} ${pinY + 20} Q ${pinX - 12} ${pinY} ${pinX} ${pinY - 15} Q ${pinX + 12} ${pinY} ${pinX} ${pinY + 20}`, {
                    fill: '#E74C3C', stroke: '#C0392B', strokeWidth: 1
                });
                svg.appendChild(pin);
                const pinDot = this.createCircle(pinX, pinY - 5, 4, { fill: '#FFF', stroke: 'none' });
                svg.appendChild(pinDot);
                return { height: mapH + 8 };

            case 'carousel':
                const carH = 150;
                const carBg = this.createRect(ctx.x, ctx.y, ctx.width, carH, {
                    fill: '#F0F0F0', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(carBg);
                const carText = this.createText(ctx.x + ctx.width / 2, ctx.y + carH / 2, item.items[0] || 'Slide 1', {
                    fontSize: '14', fill: '#666'
                });
                svg.appendChild(carText);
                const dotsY = ctx.y + carH - 20;
                item.items.forEach((_, idx) => {
                    const dot = this.createCircle(ctx.x + ctx.width / 2 - (item.items.length - 1) * 8 + idx * 16, dotsY, idx === 0 ? 5 : 4, {
                        fill: idx === 0 ? '#3498DB' : '#CCC', stroke: 'none'
                    });
                    svg.appendChild(dot);
                });
                const leftArrow = this.createPath(`M ${ctx.x + 15} ${ctx.y + carH / 2} l 8 -8 M ${ctx.x + 15} ${ctx.y + carH / 2} l 8 8`, {
                    stroke: '#999', strokeWidth: 2, fill: 'none'
                });
                svg.appendChild(leftArrow);
                const rightArrow = this.createPath(`M ${ctx.x + ctx.width - 15} ${ctx.y + carH / 2} l -8 -8 M ${ctx.x + ctx.width - 15} ${ctx.y + carH / 2} l -8 8`, {
                    stroke: '#999', strokeWidth: 2, fill: 'none'
                });
                svg.appendChild(rightArrow);
                return { height: carH + 8 };

            case 'timeline':
                let tlY = ctx.y;
                const tlItemH = 60;
                item.events.forEach((event, idx) => {
                    const dotX = ctx.x + 10;
                    const dot = this.createCircle(dotX, tlY + 10, 6, {
                        fill: idx === 0 ? '#3498DB' : '#DDD', stroke: 'none'
                    });
                    svg.appendChild(dot);
                    if (idx < item.events.length - 1) {
                        const line = this.createLine(dotX, tlY + 20, dotX, tlY + tlItemH, {
                            stroke: '#DDD', strokeWidth: 2
                        });
                        svg.appendChild(line);
                    }
                    const eventText = this.createText(ctx.x + 30, tlY + 14, event, {
                        fontSize: '13', fill: '#333', anchor: 'start'
                    });
                    svg.appendChild(eventText);
                    tlY += tlItemH;
                });
                return { height: item.events.length * tlItemH };

            case 'skeleton':
                let skY = ctx.y;
                const skCount = item.count || 1;
                for (let i = 0; i < skCount; i++) {
                    if (item.skeletonType === 'text') {
                        const line1 = this.createRect(ctx.x, skY, ctx.width, 12, {
                            fill: '#E0E0E0', stroke: 'none', rx: 4
                        });
                        svg.appendChild(line1);
                        const line2 = this.createRect(ctx.x, skY + 20, ctx.width * 0.7, 12, {
                            fill: '#E0E0E0', stroke: 'none', rx: 4
                        });
                        svg.appendChild(line2);
                        skY += 45;
                    } else if (item.skeletonType === 'card') {
                        const cardSk = this.createRect(ctx.x, skY, ctx.width, 80, {
                            fill: '#E0E0E0', stroke: 'none', rx: 8
                        });
                        svg.appendChild(cardSk);
                        skY += 90;
                    } else if (item.skeletonType === 'avatar') {
                        const avSk = this.createCircle(ctx.x + 20, skY + 20, 20, {
                            fill: '#E0E0E0', stroke: 'none'
                        });
                        svg.appendChild(avSk);
                        const avLineSk = this.createRect(ctx.x + 50, skY + 10, 100, 12, {
                            fill: '#E0E0E0', stroke: 'none', rx: 4
                        });
                        svg.appendChild(avLineSk);
                        skY += 50;
                    } else if (item.skeletonType === 'image') {
                        const imgSk = this.createRect(ctx.x, skY, ctx.width, 120, {
                            fill: '#E0E0E0', stroke: 'none', rx: 8
                        });
                        svg.appendChild(imgSk);
                        skY += 130;
                    }
                }
                return { height: skY - ctx.y };

            case 'accordion':
                let accY = ctx.y;
                const accItemH = 48;
                item.items.forEach((title, idx) => {
                    const accBg = this.createRect(ctx.x, accY, ctx.width, accItemH, {
                        fill: '#FFF', stroke: '#E0E0E0', rx: idx === 0 ? 8 : 0
                    });
                    svg.appendChild(accBg);
                    const accTitle = this.createText(ctx.x + 16, accY + accItemH / 2 + 5, title, {
                        fontSize: '14', fill: '#333', anchor: 'start'
                    });
                    svg.appendChild(accTitle);
                    const accArrow = this.createPath(`M ${ctx.x + ctx.width - 20} ${accY + accItemH / 2 - 3} l 6 6 l 6 -6`, {
                        stroke: '#666', strokeWidth: 2, fill: 'none'
                    });
                    svg.appendChild(accArrow);
                    accY += accItemH - 1;
                });
                return { height: accY - ctx.y + 8 };

            case 'chip':
                let chipX = ctx.x;
                const chipH = 32;
                item.items.forEach((chipText) => {
                    const chipW = chipText.length * 8 + 24;
                    const chipBg = this.createRect(chipX, ctx.y, chipW, chipH, {
                        fill: '#F0F0F0', stroke: '#E0E0E0', rx: chipH / 2
                    });
                    svg.appendChild(chipBg);
                    const chipLabel = this.createText(chipX + chipW / 2, ctx.y + chipH / 2 + 5, chipText, {
                        fontSize: '12', fill: '#333'
                    });
                    svg.appendChild(chipLabel);
                    chipX += chipW + 8;
                });
                return { height: chipH + 8 };

            case 'tooltip':
                const ttW = item.text.length * 7 + 20;
                const ttH = 30;
                const ttBg = this.createRect(ctx.x, ctx.y, ttW, ttH, {
                    fill: '#333', stroke: 'none', rx: 4
                });
                svg.appendChild(ttBg);
                const ttArrow = this.createPath(`M ${ctx.x + ttW / 2 - 6} ${ctx.y + ttH} l 6 8 l 6 -8`, {
                    fill: '#333', stroke: 'none'
                });
                svg.appendChild(ttArrow);
                const ttText = this.createText(ctx.x + ttW / 2, ctx.y + ttH / 2 + 5, item.text, {
                    fontSize: '12', fill: '#FFF'
                });
                svg.appendChild(ttText);
                return { height: ttH + 16 };

            case 'modal':
                const modalW = Math.min(ctx.width, 280);
                const modalH = 150;
                const modalX = ctx.x + (ctx.width - modalW) / 2;
                const modalBg = this.createRect(modalX, ctx.y, modalW, modalH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 12
                });
                svg.appendChild(modalBg);
                const modalHeader = this.createRect(modalX, ctx.y, modalW, 44, {
                    fill: '#F9F9F9', stroke: 'none', rx: 12
                });
                svg.appendChild(modalHeader);
                const modalTitle = this.createText(modalX + modalW / 2, ctx.y + 28, item.title, {
                    fontSize: '14', fontWeight: 'bold', fill: '#333'
                });
                svg.appendChild(modalTitle);
                const modalClose = this.createText(modalX + modalW - 16, ctx.y + 28, '×', {
                    fontSize: '20', fill: '#999', anchor: 'end'
                });
                svg.appendChild(modalClose);
                const modalContent = this.createRect(modalX + 16, ctx.y + 60, modalW - 32, 30, {
                    fill: '#F0F0F0', stroke: 'none', rx: 4
                });
                svg.appendChild(modalContent);
                const modalBtn = this.createRect(modalX + modalW - 80, ctx.y + modalH - 44, 64, 32, {
                    fill: '#3498DB', stroke: 'none', rx: 6
                });
                svg.appendChild(modalBtn);
                const modalBtnText = this.createText(modalX + modalW - 48, ctx.y + modalH - 22, '확인', {
                    fontSize: '13', fill: '#FFF'
                });
                svg.appendChild(modalBtnText);
                return { height: modalH + 16 };

            case 'form':
                const formH = 200;
                const formBg = this.createRect(ctx.x, ctx.y, ctx.width, formH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(formBg);
                const formTitle = this.createText(ctx.x + ctx.width / 2, ctx.y + 30, item.title, {
                    fontSize: '16', fontWeight: 'bold', fill: '#333'
                });
                svg.appendChild(formTitle);
                for (let i = 0; i < 3; i++) {
                    const fieldY = ctx.y + 50 + i * 45;
                    const field = this.createRect(ctx.x + 16, fieldY, ctx.width - 32, 36, {
                        fill: '#FFF', stroke: '#DDD', rx: 6
                    });
                    svg.appendChild(field);
                }
                const formBtn = this.createRect(ctx.x + 16, ctx.y + formH - 50, ctx.width - 32, 36, {
                    fill: '#3498DB', stroke: 'none', rx: 6
                });
                svg.appendChild(formBtn);
                const formBtnText = this.createText(ctx.x + ctx.width / 2, ctx.y + formH - 26, '제출', {
                    fontSize: '14', fontWeight: '600', fill: '#FFF'
                });
                svg.appendChild(formBtnText);
                return { height: formH + 8 };

            case 'stats':
                const statsH = 70;
                const statsBg = this.createRect(ctx.x, ctx.y, ctx.width, statsH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(statsBg);
                if (item.icon) {
                    this.renderWfIcon(svg, item.icon, ctx.x + 16, ctx.y + 20, 28, '#3498DB');
                }
                const statsLabel = this.createText(ctx.x + (item.icon ? 60 : 16), ctx.y + 28, item.label, {
                    fontSize: '12', fill: '#666', anchor: 'start'
                });
                svg.appendChild(statsLabel);
                const statsValue = this.createText(ctx.x + (item.icon ? 60 : 16), ctx.y + 50, item.value, {
                    fontSize: '20', fontWeight: 'bold', fill: '#333', anchor: 'start'
                });
                svg.appendChild(statsValue);
                return { height: statsH + 8 };

            case 'social':
                const socialIcons = {
                    facebook: '#1877F2', twitter: '#1DA1F2', instagram: '#E4405F',
                    linkedin: '#0A66C2', youtube: '#FF0000', github: '#333'
                };
                let socX = ctx.x;
                item.networks.forEach((network) => {
                    const socCircle = this.createCircle(socX + 18, ctx.y + 18, 18, {
                        fill: socialIcons[network.toLowerCase()] || '#999', stroke: 'none'
                    });
                    svg.appendChild(socCircle);
                    const initial = network.charAt(0).toUpperCase();
                    const socText = this.createText(socX + 18, ctx.y + 24, initial, {
                        fontSize: '14', fontWeight: 'bold', fill: '#FFF'
                    });
                    svg.appendChild(socText);
                    socX += 44;
                });
                return { height: 44 };

            case 'calendar':
                const calH = 220;
                const calW = ctx.width;
                const calBg = this.createRect(ctx.x, ctx.y, calW, calH, {
                    fill: '#FFF', stroke: '#E0E0E0', rx: 8
                });
                svg.appendChild(calBg);
                const calHeader = this.createRect(ctx.x, ctx.y, calW, 40, {
                    fill: '#3498DB', stroke: 'none', rx: 8
                });
                svg.appendChild(calHeader);
                const calMonth = this.createText(ctx.x + calW / 2, ctx.y + 26, '2024년 1월', {
                    fontSize: '14', fontWeight: 'bold', fill: '#FFF'
                });
                svg.appendChild(calMonth);
                const days = ['일', '월', '화', '수', '목', '금', '토'];
                const dayW = calW / 7;
                days.forEach((day, idx) => {
                    const dayText = this.createText(ctx.x + dayW * idx + dayW / 2, ctx.y + 60, day, {
                        fontSize: '11', fill: idx === 0 ? '#E74C3C' : '#666'
                    });
                    svg.appendChild(dayText);
                });
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 7; col++) {
                        const dateNum = row * 7 + col + 1;
                        if (dateNum <= 31) {
                            const dateText = this.createText(ctx.x + dayW * col + dayW / 2, ctx.y + 90 + row * 25, dateNum.toString(), {
                                fontSize: '12', fill: col === 0 ? '#E74C3C' : '#333'
                            });
                            svg.appendChild(dateText);
                        }
                    }
                }
                return { height: calH + 8 };

            case 'textarea':
                const taH = 100;
                const taBg = this.createRect(ctx.x, ctx.y, ctx.width, taH, {
                    fill: '#FFF', stroke: '#DDD', rx: 6
                });
                svg.appendChild(taBg);
                const taText = this.createText(ctx.x + 12, ctx.y + 24, item.placeholder, {
                    fontSize: '13', fill: '#999', anchor: 'start'
                });
                svg.appendChild(taText);
                const taHandle = this.createPath(`M ${ctx.x + ctx.width - 16} ${ctx.y + taH - 4} l 8 -8 M ${ctx.x + ctx.width - 12} ${ctx.y + taH - 4} l 4 -4`, {
                    stroke: '#CCC', strokeWidth: 1, fill: 'none'
                });
                svg.appendChild(taHandle);
                return { height: taH + 8 };

            case 'file':
                const fileH = 80;
                const fileBg = this.createRect(ctx.x, ctx.y, ctx.width, fileH, {
                    fill: '#FAFAFA', stroke: '#DDD', rx: 8, strokeDasharray: '6,4'
                });
                svg.appendChild(fileBg);
                const fileIcon = this.createText(ctx.x + ctx.width / 2, ctx.y + 35, '📁', {
                    fontSize: '24', fill: '#999'
                });
                svg.appendChild(fileIcon);
                const fileLabel = this.createText(ctx.x + ctx.width / 2, ctx.y + 60, item.label, {
                    fontSize: '12', fill: '#666'
                });
                svg.appendChild(fileLabel);
                return { height: fileH + 8 };

            case 'color':
                const colorH = 40;
                const colorPreview = this.createRect(ctx.x, ctx.y, 40, colorH, {
                    fill: '#3498DB', stroke: '#DDD', rx: 6
                });
                svg.appendChild(colorPreview);
                const colorInput = this.createRect(ctx.x + 48, ctx.y, ctx.width - 48, colorH, {
                    fill: '#FFF', stroke: '#DDD', rx: 6
                });
                svg.appendChild(colorInput);
                const colorText = this.createText(ctx.x + 60, ctx.y + colorH / 2 + 5, item.label, {
                    fontSize: '13', fill: '#333', anchor: 'start'
                });
                svg.appendChild(colorText);
                return { height: colorH + 8 };

            case 'date':
                const dateH = 44;
                const dateBg = this.createRect(ctx.x, ctx.y, ctx.width, dateH, {
                    fill: '#FFF', stroke: '#DDD', rx: 6
                });
                svg.appendChild(dateBg);
                const dateText = this.createText(ctx.x + 12, ctx.y + dateH / 2 + 4, item.label, {
                    fontSize: '13', fill: '#999', anchor: 'start'
                });
                svg.appendChild(dateText);
                const dateIcon = this.createText(ctx.x + ctx.width - 16, ctx.y + dateH / 2 + 4, '📅', {
                    fontSize: '16', fill: '#666', anchor: 'end'
                });
                svg.appendChild(dateIcon);
                return { height: dateH + 8 };

            case 'time':
                const timeH = 44;
                const timeBg = this.createRect(ctx.x, ctx.y, ctx.width, timeH, {
                    fill: '#FFF', stroke: '#DDD', rx: 6
                });
                svg.appendChild(timeBg);
                const timeText = this.createText(ctx.x + 12, ctx.y + timeH / 2 + 4, item.label, {
                    fontSize: '13', fill: '#999', anchor: 'start'
                });
                svg.appendChild(timeText);
                const timeIcon = this.createText(ctx.x + ctx.width - 16, ctx.y + timeH / 2 + 4, '🕐', {
                    fontSize: '16', fill: '#666', anchor: 'end'
                });
                svg.appendChild(timeIcon);
                return { height: timeH + 8 };

            default:
                return { height: 0 };
        }
    }

    renderWfBottomNav(svg, element, ctx) {
        const h = 56;
        const y = ctx.height - h;

        // 배경
        const bg = this.createRect(0, y, ctx.fullWidth, h, {
            fill: '#FFF', stroke: 'none'
        });
        svg.appendChild(bg);

        // 상단 라인
        const line = this.createLine(0, y, ctx.fullWidth, y, {
            stroke: '#E0E0E0', strokeWidth: 1
        });
        svg.appendChild(line);

        const itemCount = element.items.length;
        const spacing = ctx.fullWidth / itemCount;

        element.items.forEach((item, idx) => {
            const itemX = spacing * idx + spacing / 2;
            const itemY = y + h / 2;

            if (item.type === 'icon') {
                this.renderWfIcon(svg, item.name, itemX - 12, itemY - 12, 24, item.active ? '#3498DB' : '#999');
            }
        });

        return { height: 0 };
    }

    renderWfPost(svg, element, ctx) {
        let currentY = ctx.y;
        const padding = 12;

        element.items.forEach(item => {
            if (item.type === 'avatar') {
                const avatarCircle = this.createCircle(ctx.x + padding + 18, currentY + 18, 18, {
                    fill: '#E0E0E0', stroke: '#CCC'
                });
                svg.appendChild(avatarCircle);
                const userName = this.createText(ctx.x + padding + 50, currentY + 22, item.name, {
                    fontSize: '13', fontWeight: 'bold', fill: '#333', anchor: 'start'
                });
                svg.appendChild(userName);
                currentY += 50;
            } else if (item.type === 'image') {
                const imgH = 250;
                const imgBg = this.createRect(ctx.x, currentY, ctx.width, imgH, {
                    fill: '#F0F0F0', stroke: 'none'
                });
                svg.appendChild(imgBg);
                currentY += imgH;
            } else if (item.type === 'icons') {
                const iconsY = currentY + 12;
                let iconX = ctx.x + padding;
                item.names.forEach(name => {
                    this.renderWfIcon(svg, name, iconX, iconsY, 22);
                    iconX += 40;
                });
                currentY += 45;
            } else if (item.type === 'text') {
                const text = this.createText(ctx.x + padding, currentY + 14, item.content, {
                    fontSize: '13', fill: '#333', anchor: 'start'
                });
                svg.appendChild(text);
                currentY += 24;
            }
        });

        return { height: currentY - ctx.y + padding };
    }

    renderWfIcon(svg, name, x, y, size, color = '#666') {
        // 간단한 아이콘 렌더링 (실제 아이콘 대신 placeholder)
        const iconBg = this.createRect(x, y, size, size, {
            fill: 'none', stroke: 'none'
        });
        svg.appendChild(iconBg);

        // 아이콘별 심플 SVG
        switch (name.toLowerCase()) {
            case 'home':
                const homePath = this.createPath(`M ${x + size / 2} ${y + 4} L ${x + 4} ${y + size / 2} L ${x + 4} ${y + size - 4} L ${x + size - 4} ${y + size - 4} L ${x + size - 4} ${y + size / 2} Z`, {
                    fill: color, stroke: 'none'
                });
                svg.appendChild(homePath);
                break;
            case 'search':
                const searchCircle = this.createCircle(x + size / 2 - 2, y + size / 2 - 2, size / 3, {
                    fill: 'none', stroke: color, strokeWidth: 2
                });
                svg.appendChild(searchCircle);
                const searchLine = this.createLine(x + size / 2 + 3, y + size / 2 + 3, x + size - 4, y + size - 4, {
                    stroke: color, strokeWidth: 2
                });
                svg.appendChild(searchLine);
                break;
            case 'heart':
                const heartPath = this.createPath(`M ${x + size / 2} ${y + size - 5} C ${x + 2} ${y + size / 2} ${x + 2} ${y + 5} ${x + size / 2} ${y + size / 3} C ${x + size - 2} ${y + 5} ${x + size - 2} ${y + size / 2} ${x + size / 2} ${y + size - 5}`, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(heartPath);
                break;
            case 'user':
                const userHead = this.createCircle(x + size / 2, y + size / 3, size / 4, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(userHead);
                const userBody = this.createPath(`M ${x + 4} ${y + size - 3} Q ${x + size / 2} ${y + size / 2} ${x + size - 4} ${y + size - 3}`, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(userBody);
                break;
            case 'cart':
                const cartBody = this.createPath(`M ${x + 4} ${y + 6} L ${x + 8} ${y + 6} L ${x + 10} ${y + size - 8} L ${x + size - 4} ${y + size - 8} L ${x + size - 2} ${y + 6}`, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(cartBody);
                const wheel1 = this.createCircle(x + 11, y + size - 4, 2, { fill: color });
                const wheel2 = this.createCircle(x + size - 6, y + size - 4, 2, { fill: color });
                svg.appendChild(wheel1);
                svg.appendChild(wheel2);
                break;
            case 'add':
                const addLine1 = this.createLine(x + size / 2, y + 4, x + size / 2, y + size - 4, { stroke: color, strokeWidth: 2 });
                const addLine2 = this.createLine(x + 4, y + size / 2, x + size - 4, y + size / 2, { stroke: color, strokeWidth: 2 });
                svg.appendChild(addLine1);
                svg.appendChild(addLine2);
                break;
            case 'message':
                const msgBg = this.createRect(x + 3, y + 5, size - 6, size - 10, {
                    fill: 'none', stroke: color, strokeWidth: 1.5, rx: 3
                });
                svg.appendChild(msgBg);
                break;
            case 'comment':
                const commentBg = this.createRect(x + 3, y + 3, size - 6, size - 8, {
                    fill: 'none', stroke: color, strokeWidth: 1.5, rx: 3
                });
                svg.appendChild(commentBg);
                break;
            case 'share':
                const sharePath = this.createPath(`M ${x + size - 6} ${y + 6} L ${x + 4} ${y + size / 2} L ${x + size - 6} ${y + size - 6}`, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(sharePath);
                break;
            case 'bookmark':
                const bmPath = this.createPath(`M ${x + 6} ${y + 4} L ${x + 6} ${y + size - 4} L ${x + size / 2} ${y + size - 10} L ${x + size - 6} ${y + size - 4} L ${x + size - 6} ${y + 4} Z`, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(bmPath);
                break;
            default:
                // 기본 placeholder 원
                const defaultIcon = this.createCircle(x + size / 2, y + size / 2, size / 3, {
                    fill: 'none', stroke: color, strokeWidth: 1.5
                });
                svg.appendChild(defaultIcon);
        }
    }

    renderWfComponent(svg, element, ctx) {
        return this.renderWfSectionItem(svg, element, {
            ...ctx,
            x: ctx.x + ctx.cfg.padding,
            width: ctx.width - ctx.cfg.padding * 2
        });
    }

    showError(message) {
        this.container.innerHTML = `<div class="error-message">오류: ${message}</div>`;
    }

    exportAsSvg() {
        const svg = this.container.querySelector('svg');
        if (!svg) {
            alert('내보낼 다이어그램이 없습니다.');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.svg';
        a.click();
        URL.revokeObjectURL(url);
    }

    exportAsPng() {
        const svg = this.container.querySelector('svg');
        if (!svg) {
            alert('내보낼 다이어그램이 없습니다.');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = parseInt(svg.getAttribute('width')) * 2;
        canvas.height = parseInt(svg.getAttribute('height')) * 2;

        img.onload = () => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const pngUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'diagram.png';
            a.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
}

// 전역 렌더러 인스턴스
let diagramRenderer;
