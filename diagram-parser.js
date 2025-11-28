/**
 * Diagram Parser
 * Mermaid-like syntax를 파싱하여 다이어그램 데이터로 변환
 * 지원: flowchart, sequenceDiagram, stateDiagram, mindmap, pie, classDiagram, erDiagram, gantt, journey
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
        // New diagram types
        this.pieData = [];
        this.pieTitle = '';
        this.classes = [];
        this.classRelations = [];
        this.entities = [];
        this.entityRelations = [];
        this.ganttTasks = [];
        this.ganttSections = [];
        this.ganttTitle = '';
        this.journeyTitle = '';
        this.journeySections = [];
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
        } else if (firstLine.startsWith('pie')) {
            return this.parsePieChart(lines);
        } else if (firstLine.startsWith('classdiagram')) {
            return this.parseClassDiagram(lines);
        } else if (firstLine.startsWith('erdiagram')) {
            return this.parseErDiagram(lines);
        } else if (firstLine.startsWith('gantt')) {
            return this.parseGantt(lines);
        } else if (firstLine.startsWith('journey')) {
            return this.parseJourney(lines);
        } else {
            throw new Error(`지원하지 않는 다이어그램 타입입니다. flowchart, sequenceDiagram, stateDiagram, mindmap, pie, classDiagram, erDiagram, gantt, journey 중 하나를 사용하세요.`);
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

    // ===== Pie Chart Parser =====
    parsePieChart(lines) {
        this.diagramType = 'pie';

        // 첫 줄에서 showData 옵션과 title 확인
        const firstLine = lines[0];
        const showDataMatch = firstLine.match(/showData/i);
        const titleMatch = firstLine.match(/title\s+(.+)$/i);

        let showData = !!showDataMatch;
        if (titleMatch) {
            this.pieTitle = titleMatch[1].trim();
        }

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // title 정의
            const lineTitleMatch = line.match(/^title\s+(.+)$/i);
            if (lineTitleMatch) {
                this.pieTitle = lineTitleMatch[1].trim();
                continue;
            }

            // 데이터: "Label" : value
            const dataMatch = line.match(/^"([^"]+)"\s*:\s*(\d+(?:\.\d+)?)$/);
            if (dataMatch) {
                this.pieData.push({
                    label: dataMatch[1],
                    value: parseFloat(dataMatch[2])
                });
            }
        }

        return {
            type: 'pie',
            title: this.pieTitle,
            data: this.pieData,
            showData
        };
    }

    // ===== Class Diagram Parser =====
    parseClassDiagram(lines) {
        this.diagramType = 'classDiagram';

        const classMap = new Map();

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // class 정의: class ClassName
            const classDefMatch = line.match(/^class\s+(\w+)(?:\s*\{)?$/);
            if (classDefMatch) {
                const className = classDefMatch[1];
                if (!classMap.has(className)) {
                    classMap.set(className, { name: className, attributes: [], methods: [] });
                }
                continue;
            }

            // 클래스 멤버: ClassName : +attribute or +method()
            const memberMatch = line.match(/^(\w+)\s*:\s*([+\-#~])?(.+)$/);
            if (memberMatch) {
                const [, className, visibility, member] = memberMatch;
                if (!classMap.has(className)) {
                    classMap.set(className, { name: className, attributes: [], methods: [] });
                }
                const classObj = classMap.get(className);
                const isMethod = member.includes('(');
                if (isMethod) {
                    classObj.methods.push({ visibility: visibility || '+', name: member.trim() });
                } else {
                    classObj.attributes.push({ visibility: visibility || '+', name: member.trim() });
                }
                continue;
            }

            // 관계: ClassA <|-- ClassB (상속), ClassA *-- ClassB (컴포지션), etc.
            const relationMatch = line.match(/^(\w+)\s*(<\|--|<\.\.|\*--|o--|-->|--\*|--o|\.\.>|--)\s*(\w+)(?:\s*:\s*(.+))?$/);
            if (relationMatch) {
                const [, classA, relation, classB, label] = relationMatch;

                // 클래스 자동 등록
                if (!classMap.has(classA)) {
                    classMap.set(classA, { name: classA, attributes: [], methods: [] });
                }
                if (!classMap.has(classB)) {
                    classMap.set(classB, { name: classB, attributes: [], methods: [] });
                }

                let relationType = 'association';
                if (relation.includes('<|')) relationType = 'inheritance';
                else if (relation.includes('*')) relationType = 'composition';
                else if (relation.includes('o')) relationType = 'aggregation';
                else if (relation.includes('..')) relationType = 'dependency';

                this.classRelations.push({
                    from: classA,
                    to: classB,
                    type: relationType,
                    label: label || ''
                });
            }

            // 주석 정의: <<interface>> ClassName
            const stereotypeMatch = line.match(/^<<(\w+)>>\s*(\w+)$/);
            if (stereotypeMatch) {
                const [, stereotype, className] = stereotypeMatch;
                if (!classMap.has(className)) {
                    classMap.set(className, { name: className, attributes: [], methods: [], stereotype });
                } else {
                    classMap.get(className).stereotype = stereotype;
                }
            }
        }

        this.classes = Array.from(classMap.values());

        return {
            type: 'classDiagram',
            classes: this.classes,
            relations: this.classRelations
        };
    }

    // ===== ER Diagram Parser =====
    parseErDiagram(lines) {
        this.diagramType = 'erDiagram';

        const entityMap = new Map();

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // 관계: ENTITY1 ||--o{ ENTITY2 : relationship
            const relationMatch = line.match(/^(\w+)\s*(\|\||\|o|o\||\}o|o\{|\}\||\|\{|\|\|)?(--)?(\|\||o\||o\{|\{o|\|o|\{\||\|\{|\|\|)?\s*(\w+)\s*:\s*(.+)$/);
            if (relationMatch) {
                const [, entity1, leftCard, , rightCard, entity2, label] = relationMatch;

                // 엔티티 자동 등록
                if (!entityMap.has(entity1)) {
                    entityMap.set(entity1, { name: entity1, attributes: [] });
                }
                if (!entityMap.has(entity2)) {
                    entityMap.set(entity2, { name: entity2, attributes: [] });
                }

                // 카디널리티 해석
                const leftCardinality = this.parseCardinality(leftCard);
                const rightCardinality = this.parseCardinality(rightCard);

                this.entityRelations.push({
                    from: entity1,
                    to: entity2,
                    label: label.trim(),
                    leftCardinality,
                    rightCardinality
                });
                continue;
            }

            // 엔티티 속성 정의: ENTITY { type name PK/FK }
            const entityAttrMatch = line.match(/^(\w+)\s*\{$/);
            if (entityAttrMatch) {
                const entityName = entityAttrMatch[1];
                if (!entityMap.has(entityName)) {
                    entityMap.set(entityName, { name: entityName, attributes: [] });
                }

                // 속성들 파싱
                i++;
                while (i < lines.length) {
                    const attrLine = lines[i].trim();
                    if (attrLine === '}') break;

                    const attrMatch = attrLine.match(/^(\w+)\s+(\w+)(?:\s+(PK|FK|UK))?$/);
                    if (attrMatch) {
                        entityMap.get(entityName).attributes.push({
                            type: attrMatch[1],
                            name: attrMatch[2],
                            key: attrMatch[3] || null
                        });
                    }
                    i++;
                }
            }
        }

        this.entities = Array.from(entityMap.values());

        return {
            type: 'erDiagram',
            entities: this.entities,
            relations: this.entityRelations
        };
    }

    parseCardinality(card) {
        if (!card) return 'one';
        if (card.includes('{') || card.includes('}')) return 'many';
        if (card.includes('o')) return 'zero-or-one';
        return 'one';
    }

    // ===== Gantt Chart Parser =====
    parseGantt(lines) {
        this.diagramType = 'gantt';

        let currentSection = 'default';
        const sections = new Map();
        sections.set('default', []);

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // title
            const titleMatch = line.match(/^title\s+(.+)$/i);
            if (titleMatch) {
                this.ganttTitle = titleMatch[1].trim();
                continue;
            }

            // dateFormat
            const dateFormatMatch = line.match(/^dateFormat\s+(.+)$/i);
            if (dateFormatMatch) {
                // dateFormat 저장 (렌더링에서 사용)
                this.dateFormat = dateFormatMatch[1].trim();
                continue;
            }

            // section
            const sectionMatch = line.match(/^section\s+(.+)$/i);
            if (sectionMatch) {
                currentSection = sectionMatch[1].trim();
                if (!sections.has(currentSection)) {
                    sections.set(currentSection, []);
                }
                continue;
            }

            // task: TaskName :status, id, startDate, duration/endDate
            // 또는 간단히: TaskName : startDate, duration
            const taskMatch = line.match(/^(.+?)\s*:\s*(.+)$/);
            if (taskMatch) {
                const taskName = taskMatch[1].trim();
                const taskParams = taskMatch[2].split(',').map(p => p.trim());

                const task = { name: taskName, section: currentSection };

                // 파라미터 파싱
                for (const param of taskParams) {
                    if (param === 'done' || param === 'active' || param === 'crit') {
                        task.status = param;
                    } else if (param.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        if (!task.start) task.start = param;
                        else task.end = param;
                    } else if (param.match(/^\d+d$/)) {
                        task.duration = parseInt(param);
                    } else if (param.startsWith('after ')) {
                        task.after = param.replace('after ', '');
                    } else if (!task.id && param.match(/^\w+$/)) {
                        task.id = param;
                    }
                }

                // 기본 기간 설정
                if (!task.duration && !task.end) {
                    task.duration = 1;
                }

                sections.get(currentSection).push(task);
            }
        }

        // 섹션 데이터 변환
        this.ganttSections = Array.from(sections.entries()).map(([name, tasks]) => ({
            name,
            tasks
        }));

        return {
            type: 'gantt',
            title: this.ganttTitle,
            dateFormat: this.dateFormat || 'YYYY-MM-DD',
            sections: this.ganttSections
        };
    }

    // ===== User Journey Parser =====
    parseJourney(lines) {
        this.diagramType = 'journey';

        let currentSection = 'default';
        const sections = new Map();
        sections.set('default', []);

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // title
            const titleMatch = line.match(/^title\s+(.+)$/i);
            if (titleMatch) {
                this.journeyTitle = titleMatch[1].trim();
                continue;
            }

            // section
            const sectionMatch = line.match(/^section\s+(.+)$/i);
            if (sectionMatch) {
                currentSection = sectionMatch[1].trim();
                if (!sections.has(currentSection)) {
                    sections.set(currentSection, []);
                }
                continue;
            }

            // task: TaskName: score: actor1, actor2
            const taskMatch = line.match(/^(.+?)\s*:\s*(\d+)\s*:\s*(.+)$/);
            if (taskMatch) {
                const [, taskName, score, actors] = taskMatch;
                sections.get(currentSection).push({
                    name: taskName.trim(),
                    score: parseInt(score),
                    actors: actors.split(',').map(a => a.trim())
                });
            }
        }

        this.journeySections = Array.from(sections.entries()).map(([name, tasks]) => ({
            name,
            tasks
        }));

        return {
            type: 'journey',
            title: this.journeyTitle,
            sections: this.journeySections
        };
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
