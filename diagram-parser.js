/**
 * Diagram Parser
 * Mermaid-like syntax를 파싱하여 다이어그램 데이터로 변환
 * 지원: flowchart, sequenceDiagram, stateDiagram, mindmap
 */

class DiagramParser {
    constructor() {
        this.reset();
    }

    reset() {
        this.nodes = [];
        this.edges = [];
        this.participants = [];
        this.messages = [];
        this.states = [];
        this.transitions = [];
        this.mindmapRoot = null;
        this.diagramType = null;
        this.direction = 'TD';
    }

    parse(code) {
        this.reset();

        // 주석 제거
        code = code.replace(/%%.*$/gm, '');

        const lines = code.split('\n').map(l => l.trimEnd()).filter(l => l.trim());

        if (lines.length === 0) {
            throw new Error('코드가 비어있습니다.');
        }

        // 다이어그램 타입 감지
        const firstLine = lines[0].trim().toLowerCase();

        if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
            return this.parseFlowchart(lines);
        } else if (firstLine.startsWith('sequencediagram')) {
            return this.parseSequenceDiagram(lines);
        } else if (firstLine.startsWith('statediagram')) {
            return this.parseStateDiagram(lines);
        } else if (firstLine.startsWith('mindmap')) {
            return this.parseMindmap(lines);
        } else {
            throw new Error(`지원하지 않는 다이어그램 타입입니다. flowchart, sequenceDiagram, stateDiagram, mindmap 중 하나를 사용하세요.`);
        }
    }

    // ===== Flowchart Parser =====
    parseFlowchart(lines) {
        this.diagramType = 'flowchart';

        // 방향 파싱
        const firstLine = lines[0].trim();
        const dirMatch = firstLine.match(/(?:flowchart|graph)\s+(TD|TB|BT|LR|RL)/i);
        this.direction = dirMatch ? dirMatch[1].toUpperCase() : 'TD';

        const nodeMap = new Map();

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // subgraph 처리
            if (line.toLowerCase().startsWith('subgraph')) {
                continue;
            }
            if (line.toLowerCase() === 'end') {
                continue;
            }

            // 엣지 파싱: A --> B, A -->|label| B, A --- B
            const edgePatterns = [
                // A -->|label| B
                /^(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\[([^\]]*)\]\])?\s*([-=.]+>|[-=.]+|--?>|==?>|-.->)\s*(?:\|([^|]*)\|)?\s*(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\[([^\]]*)\]\])?$/,
                // A[label] --> B[label]
                /^(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\[([^\]]*)\]\])?\s*([-=.]+>|[-=.]+|--?>|==?>|-.->)\s*(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\[([^\]]*)\]\])?(?:\s*:\s*(.+))?$/,
            ];

            let matched = false;

            // 연결 관계 파싱
            const edgeRegex = /^([^\s\[\]{}()]+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\))?(\s*)(-->|---|-\.->|==>)(\s*)(?:\|([^|]*)\|)?(\s*)([^\s\[\]{}()]+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\))?$/;

            const simpleEdgeMatch = line.match(edgeRegex);

            if (simpleEdgeMatch) {
                const [, fromId, fromRect, fromRound, fromDiamond, fromCircle, , arrow, , label, , toId, toRect, toRound, toDiamond, toCircle] = simpleEdgeMatch;

                // 소스 노드 등록
                this.registerNode(nodeMap, fromId, fromRect || fromRound || fromDiamond || fromCircle,
                    fromRect ? 'rect' : fromRound ? 'round' : fromDiamond ? 'diamond' : fromCircle ? 'circle' : 'rect');

                // 타겟 노드 등록
                this.registerNode(nodeMap, toId, toRect || toRound || toDiamond || toCircle,
                    toRect ? 'rect' : toRound ? 'round' : toDiamond ? 'diamond' : toCircle ? 'circle' : 'rect');

                // 엣지 등록
                this.edges.push({
                    from: fromId,
                    to: toId,
                    label: label || '',
                    type: arrow.includes('=') ? 'thick' : arrow.includes('.') ? 'dotted' : 'solid',
                    hasArrow: arrow.includes('>')
                });

                matched = true;
            }

            // 단일 노드 정의
            if (!matched) {
                const nodeMatch = line.match(/^(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|\(\(([^)]*)\)\)|\[\[([^\]]*)\]\])$/);
                if (nodeMatch) {
                    const [, id, rect, round, diamond, circle, subroutine] = nodeMatch;
                    const label = rect || round || diamond || circle || subroutine || id;
                    const shape = rect ? 'rect' : round ? 'round' : diamond ? 'diamond' : circle ? 'circle' : subroutine ? 'subroutine' : 'rect';
                    this.registerNode(nodeMap, id, label, shape);
                }
            }
        }

        this.nodes = Array.from(nodeMap.values());

        return {
            type: 'flowchart',
            direction: this.direction,
            nodes: this.nodes,
            edges: this.edges
        };
    }

    registerNode(nodeMap, id, label, shape) {
        if (!nodeMap.has(id)) {
            nodeMap.set(id, {
                id,
                label: label || id,
                shape: shape || 'rect'
            });
        } else if (label && !nodeMap.get(id).label) {
            nodeMap.get(id).label = label;
            if (shape) nodeMap.get(id).shape = shape;
        }
    }

    // ===== Sequence Diagram Parser =====
    parseSequenceDiagram(lines) {
        this.diagramType = 'sequenceDiagram';

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // participant 정의
            const participantMatch = line.match(/^participant\s+(\w+)(?:\s+as\s+(.+))?$/i);
            if (participantMatch) {
                this.participants.push({
                    id: participantMatch[1],
                    alias: participantMatch[2] || participantMatch[1]
                });
                continue;
            }

            // actor 정의
            const actorMatch = line.match(/^actor\s+(\w+)(?:\s+as\s+(.+))?$/i);
            if (actorMatch) {
                this.participants.push({
                    id: actorMatch[1],
                    alias: actorMatch[2] || actorMatch[1],
                    isActor: true
                });
                continue;
            }

            // 메시지 파싱: A->>B: message, A-->>B: message
            const messageMatch = line.match(/^(\w+)\s*(->>|-->>|->|--)>?\s*(\w+)\s*:\s*(.*)$/);
            if (messageMatch) {
                const [, from, arrow, to, message] = messageMatch;

                // 암묵적 participant 추가
                this.ensureParticipant(from);
                this.ensureParticipant(to);

                this.messages.push({
                    from,
                    to,
                    message: message.trim(),
                    type: arrow.includes('--') ? 'dashed' : 'solid',
                    isAsync: arrow === '->>' || arrow === '-->>',
                    isResponse: arrow.includes('--')
                });
                continue;
            }

            // Note 파싱
            const noteMatch = line.match(/^Note\s+(left of|right of|over)\s+(\w+(?:,\s*\w+)?)\s*:\s*(.*)$/i);
            if (noteMatch) {
                this.messages.push({
                    type: 'note',
                    position: noteMatch[1].toLowerCase(),
                    participants: noteMatch[2].split(',').map(p => p.trim()),
                    text: noteMatch[3]
                });
                continue;
            }

            // activate/deactivate
            const activateMatch = line.match(/^(activate|deactivate)\s+(\w+)$/i);
            if (activateMatch) {
                this.messages.push({
                    type: activateMatch[1].toLowerCase(),
                    participant: activateMatch[2]
                });
            }
        }

        return {
            type: 'sequenceDiagram',
            participants: this.participants,
            messages: this.messages
        };
    }

    ensureParticipant(id) {
        if (!this.participants.find(p => p.id === id)) {
            this.participants.push({ id, alias: id });
        }
    }

    // ===== State Diagram Parser =====
    parseStateDiagram(lines) {
        this.diagramType = 'stateDiagram';

        const stateMap = new Map();

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // state 정의: state "description" as s1
            const stateDefMatch = line.match(/^state\s+"([^"]+)"\s+as\s+(\w+)$/i);
            if (stateDefMatch) {
                const [, description, id] = stateDefMatch;
                stateMap.set(id, { id, label: description, type: 'state' });
                continue;
            }

            // 전환: [*] --> state, state --> [*], state1 --> state2
            const transitionMatch = line.match(/^(\[?\*?\]?|\w+)\s*(-->|--)\s*(\[?\*?\]?|\w+)(?:\s*:\s*(.*))?$/);
            if (transitionMatch) {
                let [, from, arrow, to, label] = transitionMatch;

                // 특수 상태 처리
                if (from === '[*]') from = '__start__';
                if (to === '[*]') to = '__end__';

                // 상태 등록
                if (from !== '__start__' && !stateMap.has(from)) {
                    stateMap.set(from, { id: from, label: from, type: 'state' });
                }
                if (to !== '__end__' && !stateMap.has(to)) {
                    stateMap.set(to, { id: to, label: to, type: 'state' });
                }

                this.transitions.push({
                    from,
                    to,
                    label: label || ''
                });
            }
        }

        this.states = Array.from(stateMap.values());

        return {
            type: 'stateDiagram',
            states: this.states,
            transitions: this.transitions
        };
    }

    // ===== Mindmap Parser =====
    parseMindmap(lines) {
        this.diagramType = 'mindmap';

        let root = null;
        const stack = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            // 들여쓰기 계산
            const indent = line.search(/\S/);
            const content = line.trim();

            // 노드 형태 파싱
            const node = this.parseMindmapNode(content);

            if (!root) {
                root = node;
                stack.push({ node, indent });
            } else {
                // 적절한 부모 찾기
                while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
                    stack.pop();
                }

                const parent = stack[stack.length - 1].node;
                if (!parent.children) parent.children = [];
                parent.children.push(node);
                stack.push({ node, indent });
            }
        }

        return {
            type: 'mindmap',
            root: root
        };
    }

    parseMindmapNode(text) {
        // root((text)) - 루트 노드 (타원)
        let match = text.match(/^root\(\((.+)\)\)$/);
        if (match) {
            return { id: this.generateId(), label: match[1], shape: 'ellipse' };
        }

        // ((text)) - 원형
        match = text.match(/^\(\((.+)\)\)$/);
        if (match) {
            return { id: this.generateId(), label: match[1], shape: 'circle' };
        }

        // [text] - 사각형
        match = text.match(/^\[(.+)\]$/);
        if (match) {
            return { id: this.generateId(), label: match[1], shape: 'rect' };
        }

        // (text) - 둥근 사각형
        match = text.match(/^\((.+)\)$/);
        if (match) {
            return { id: this.generateId(), label: match[1], shape: 'round' };
        }

        // ))text(( - 뱅
        match = text.match(/^\)\)(.+)\(\($/);
        if (match) {
            return { id: this.generateId(), label: match[1], shape: 'bang' };
        }

        // )text( - 클라우드
        match = text.match(/^\)(.+)\($/);
        if (match) {
            return { id: this.generateId(), label: match[1], shape: 'cloud' };
        }

        // 일반 텍스트
        return { id: this.generateId(), label: text, shape: 'default' };
    }

    generateId() {
        return 'node_' + Math.random().toString(36).substr(2, 9);
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
const diagramParser = new DiagramParser();
