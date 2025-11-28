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

        // 레벨 계산
        const levels = new Map();
        const visited = new Set();

        // 시작점에서 BFS
        if (allStates.has('__start__')) {
            levels.set('__start__', 0);
            visited.add('__start__');
        }

        const queue = Array.from(allStates).filter(s => !visited.has(s)).map(s => ({ id: s, level: allStates.has('__start__') ? 1 : 0 }));

        let maxLevel = 0;
        data.transitions.forEach(t => {
            const fromLevel = levels.get(t.from) || 0;
            if (!levels.has(t.to) || levels.get(t.to) < fromLevel + 1) {
                levels.set(t.to, fromLevel + 1);
                maxLevel = Math.max(maxLevel, fromLevel + 1);
            }
        });

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

        // 위치 계산
        levelGroups.forEach((states, level) => {
            states.forEach((stateId, idx) => {
                const x = cfg.padding + idx * (cfg.stateWidth + cfg.stateSpacing);
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

        const fromCx = from.x + (trans.from === '__start__' || trans.from === '__end__' ? 15 : cfg.stateWidth / 2);
        const fromCy = from.y + (trans.from === '__start__' || trans.from === '__end__' ? 25 : cfg.stateHeight / 2);
        const toCx = to.x + (trans.to === '__start__' || trans.to === '__end__' ? 15 : cfg.stateWidth / 2);
        const toCy = to.y + (trans.to === '__start__' || trans.to === '__end__' ? 25 : cfg.stateHeight / 2);

        // 시작/끝 점 조정
        let startX = fromCx, startY, endX = toCx, endY;

        if (fromCy < toCy) {
            startY = from.y + (trans.from === '__start__' || trans.from === '__end__' ? 37 : cfg.stateHeight);
            endY = to.y;
        } else {
            startY = from.y;
            endY = to.y + (trans.to === '__start__' || trans.to === '__end__' ? 50 : cfg.stateHeight);
        }

        const midY = (startY + endY) / 2;

        const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

        const path = this.createPath(pathD, {
            markerEnd: 'url(#arrowhead)'
        });
        group.appendChild(path);

        // 라벨
        if (trans.label) {
            const labelX = (startX + endX) / 2;
            const labelY = midY;

            const bg = this.createRect(labelX - 25, labelY - 10, 50, 20, {
                fill: '#fff', stroke: 'none'
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
