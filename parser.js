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
        } else if (firstLine.startsWith('wireframe')) {
            return this.parseWireframe(lines);
        } else {
            throw new Error(`지원하지 않는 다이어그램 타입입니다. flowchart, sequenceDiagram, stateDiagram, mindmap, pie, classDiagram, erDiagram, gantt, journey, wireframe 중 하나를 사용하세요.`);
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

    // ===== Wireframe Parser =====
    parseWireframe(lines) {
        this.diagramType = 'wireframe';

        // 첫 줄에서 페이지 이름 추출
        const firstLine = lines[0];
        const titleMatch = firstLine.match(/^wireframe\s+(.+)$/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : 'Wireframe';

        let device = 'mobile'; // 기본 디바이스
        const elements = [];
        let currentBlock = null;
        let blockStack = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // device 설정
            const deviceMatch = line.match(/^device\s+(mobile|tablet|desktop)$/i);
            if (deviceMatch) {
                device = deviceMatch[1].toLowerCase();
                continue;
            }

            // statusbar (모바일)
            if (line === 'statusbar') {
                elements.push({ type: 'statusbar' });
                continue;
            }

            // bottomnav (모바일 하단 네비게이션)
            if (line === 'bottomnav') {
                currentBlock = { type: 'bottomnav', items: [] };
                blockStack.push(currentBlock);
                continue;
            }

            // header 블록 시작
            if (line === 'header') {
                currentBlock = { type: 'header', items: [] };
                blockStack.push(currentBlock);
                continue;
            }

            // footer 블록 시작
            if (line === 'footer') {
                currentBlock = { type: 'footer', items: [] };
                blockStack.push(currentBlock);
                continue;
            }

            // sidebar 블록 시작
            if (line === 'sidebar') {
                currentBlock = { type: 'sidebar', items: [] };
                blockStack.push(currentBlock);
                continue;
            }

            // section 블록 시작
            const sectionMatch = line.match(/^section\s+(.+)$/i);
            if (sectionMatch) {
                currentBlock = { type: 'section', title: sectionMatch[1], items: [] };
                blockStack.push(currentBlock);
                continue;
            }

            // post 블록 시작 (소셜 피드용)
            if (line === 'post') {
                const postBlock = { type: 'post', items: [] };
                if (currentBlock && currentBlock.items) {
                    currentBlock.items.push(postBlock);
                }
                blockStack.push(postBlock);
                currentBlock = postBlock;
                continue;
            }

            // end 블록 종료
            if (line === 'end') {
                if (blockStack.length > 0) {
                    const completedBlock = blockStack.pop();
                    if (blockStack.length === 0) {
                        elements.push(completedBlock);
                        currentBlock = null;
                    } else {
                        currentBlock = blockStack[blockStack.length - 1];
                    }
                }
                continue;
            }

            // 컴포넌트 파싱
            const component = this.parseWireframeComponent(line);
            if (component) {
                if (currentBlock && currentBlock.items) {
                    currentBlock.items.push(component);
                } else {
                    elements.push(component);
                }
            }
        }

        // 열린 블록 닫기
        while (blockStack.length > 0) {
            const block = blockStack.pop();
            if (blockStack.length === 0) {
                elements.push(block);
            }
        }

        return {
            type: 'wireframe',
            title: pageTitle,
            device,
            elements
        };
    }

    parseWireframeComponent(line) {
        // logo "텍스트"
        let match = line.match(/^logo\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'logo', text: match[1] };
        }

        // nav "item1" "item2" ...
        match = line.match(/^nav\s+(.+)$/i);
        if (match) {
            const items = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'nav', items };
        }

        // avatar "이름" [add]
        match = line.match(/^avatar\s+"([^"]+)"(?:\s+(add))?$/i);
        if (match) {
            return { type: 'avatar', name: match[1], add: !!match[2] };
        }

        // text "내용"
        match = line.match(/^text\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'text', content: match[1] };
        }

        // input type "placeholder"
        match = line.match(/^input\s+(\w+)\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'input', inputType: match[1], placeholder: match[2] };
        }

        // button primary|secondary "라벨"
        match = line.match(/^button\s+(primary|secondary)\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'button', variant: match[1], label: match[2] };
        }

        // checkbox "라벨"
        match = line.match(/^checkbox\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'checkbox', label: match[1] };
        }

        // dropdown "라벨"
        match = line.match(/^dropdown\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'dropdown', label: match[1] };
        }

        // link "텍스트"
        match = line.match(/^link\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'link', text: match[1] };
        }

        // divider or divider "텍스트"
        match = line.match(/^divider(?:\s+"([^"]+)")?$/i);
        if (match) {
            return { type: 'divider', text: match[1] || null };
        }

        // search "placeholder"
        match = line.match(/^search\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'search', placeholder: match[1] };
        }

        // icon name [active]
        match = line.match(/^icon\s+(\w+)(?:\s+(active))?$/i);
        if (match) {
            return { type: 'icon', name: match[1], active: !!match[2] };
        }

        // icons name1 name2 ...
        match = line.match(/^icons\s+(.+)$/i);
        if (match) {
            const icons = match[1].split(/\s+/);
            return { type: 'icons', names: icons };
        }

        // menu "라벨" [active]
        match = line.match(/^menu\s+"([^"]+)"(?:\s+(active))?$/i);
        if (match) {
            return { type: 'menu', label: match[1], active: !!match[2] };
        }

        // card "제목" "값" "변화"
        match = line.match(/^card\s+"([^"]+)"\s+"([^"]+)"(?:\s+"([^"]+)")?$/i);
        if (match) {
            return { type: 'card', title: match[1], value: match[2], change: match[3] || null };
        }

        // chart type "제목"
        match = line.match(/^chart\s+(bar|line|pie)\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'chart', chartType: match[1], title: match[2] };
        }

        // table "컬럼1" "컬럼2" ...
        match = line.match(/^table\s+(.+)$/i);
        if (match) {
            const columns = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'table', columns };
        }

        // product "이름" "가격" star rating
        match = line.match(/^product\s+"([^"]+)"\s+"([^"]+)"(?:\s+star\s+(\d+(?:\.\d+)?))?$/i);
        if (match) {
            return { type: 'product', name: match[1], price: match[2], rating: match[3] ? parseFloat(match[3]) : null };
        }

        // image placeholder
        match = line.match(/^image\s+(placeholder)$/i);
        if (match) {
            return { type: 'image', placeholder: true };
        }

        // pagination 1 2 3 ... 10
        match = line.match(/^pagination\s+(.+)$/i);
        if (match) {
            const pages = match[1].split(/\s+/);
            return { type: 'pagination', pages };
        }

        // radio "label" [checked]
        match = line.match(/^radio\s+"([^"]+)"(?:\s+(checked))?$/i);
        if (match) {
            return { type: 'radio', label: match[1], checked: !!match[2] };
        }

        // toggle "label" [on]
        match = line.match(/^toggle\s+"([^"]+)"(?:\s+(on))?$/i);
        if (match) {
            return { type: 'toggle', label: match[1], on: !!match[2] };
        }

        // badge "text" [color]
        match = line.match(/^badge\s+"([^"]+)"(?:\s+(red|green|blue|yellow|gray))?$/i);
        if (match) {
            return { type: 'badge', text: match[1], color: match[2] || 'blue' };
        }

        // tabs "tab1" "tab2" active:index
        match = line.match(/^tabs\s+(.+?)(?:\s+active:(\d+))?$/i);
        if (match) {
            const items = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'tabs', items, activeIndex: match[2] ? parseInt(match[2]) : 0 };
        }

        // breadcrumb "Home" "Category" "Item"
        match = line.match(/^breadcrumb\s+(.+)$/i);
        if (match) {
            const items = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'breadcrumb', items };
        }

        // progress value "label"
        match = line.match(/^progress\s+(\d+)(?:\s+"([^"]+)")?$/i);
        if (match) {
            return { type: 'progress', value: parseInt(match[1]), label: match[2] || null };
        }

        // rating value
        match = line.match(/^rating\s+(\d+(?:\.\d+)?)$/i);
        if (match) {
            return { type: 'rating', value: parseFloat(match[1]) };
        }

        // stepper active "Step1" "Step2" "Step3"
        match = line.match(/^stepper\s+(\d+)\s+(.+)$/i);
        if (match) {
            const steps = match[2].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'stepper', active: parseInt(match[1]), steps };
        }

        // list bullet|number "item1" "item2"
        match = line.match(/^list\s+(bullet|number|check)\s+(.+)$/i);
        if (match) {
            const items = match[2].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'list', listType: match[1], items };
        }

        // alert type "message"
        match = line.match(/^alert\s+(info|success|warning|error)\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'alert', alertType: match[1], message: match[2] };
        }

        // tag "text" [color]
        match = line.match(/^tag\s+"([^"]+)"(?:\s+(red|green|blue|yellow|gray|purple))?$/i);
        if (match) {
            return { type: 'tag', text: match[1], color: match[2] || 'gray' };
        }

        // slider value "label"
        match = line.match(/^slider\s+(\d+)(?:\s+"([^"]+)")?$/i);
        if (match) {
            return { type: 'slider', value: parseInt(match[1]), label: match[2] || null };
        }

        // spacer [size]
        match = line.match(/^spacer(?:\s+(\d+))?$/i);
        if (match) {
            return { type: 'spacer', size: match[1] ? parseInt(match[1]) : 20 };
        }

        // heading level "text"
        match = line.match(/^heading\s+(\d)\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'heading', level: parseInt(match[1]), text: match[2] };
        }

        // paragraph "text"
        match = line.match(/^paragraph\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'paragraph', text: match[1] };
        }

        // quote "text" "author"
        match = line.match(/^quote\s+"([^"]+)"(?:\s+"([^"]+)")?$/i);
        if (match) {
            return { type: 'quote', text: match[1], author: match[2] || null };
        }

        // video placeholder
        match = line.match(/^video\s+(placeholder)$/i);
        if (match) {
            return { type: 'video', placeholder: true };
        }

        // map placeholder
        match = line.match(/^map\s+(placeholder)$/i);
        if (match) {
            return { type: 'map', placeholder: true };
        }

        // carousel "item1" "item2"
        match = line.match(/^carousel\s+(.+)$/i);
        if (match) {
            const items = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'carousel', items };
        }

        // timeline "event1" "event2"
        match = line.match(/^timeline\s+(.+)$/i);
        if (match) {
            const events = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'timeline', events };
        }

        // skeleton lines
        match = line.match(/^skeleton\s+(text|card|image|avatar)(?:\s+(\d+))?$/i);
        if (match) {
            return { type: 'skeleton', skeletonType: match[1], count: match[2] ? parseInt(match[2]) : 1 };
        }

        // accordion "title1" "title2"
        match = line.match(/^accordion\s+(.+)$/i);
        if (match) {
            const items = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'accordion', items };
        }

        // chip "text1" "text2"
        match = line.match(/^chips?\s+(.+)$/i);
        if (match) {
            const items = match[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            return { type: 'chip', items };
        }

        // tooltip "text"
        match = line.match(/^tooltip\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'tooltip', text: match[1] };
        }

        // modal "title"
        match = line.match(/^modal\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'modal', title: match[1] };
        }

        // form "title"
        match = line.match(/^form\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'form', title: match[1] };
        }

        // stats "label" "value" [icon]
        match = line.match(/^stats\s+"([^"]+)"\s+"([^"]+)"(?:\s+(\w+))?$/i);
        if (match) {
            return { type: 'stats', label: match[1], value: match[2], icon: match[3] || null };
        }

        // social icons
        match = line.match(/^social\s+(.+)$/i);
        if (match) {
            const networks = match[1].split(/\s+/);
            return { type: 'social', networks };
        }

        // calendar placeholder
        match = line.match(/^calendar(?:\s+(placeholder))?$/i);
        if (match) {
            return { type: 'calendar', placeholder: true };
        }

        // textarea "placeholder"
        match = line.match(/^textarea\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'textarea', placeholder: match[1] };
        }

        // file "label"
        match = line.match(/^file\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'file', label: match[1] };
        }

        // color "label"
        match = line.match(/^color\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'color', label: match[1] };
        }

        // date "label"
        match = line.match(/^date\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'date', label: match[1] };
        }

        // time "label"
        match = line.match(/^time\s+"([^"]+)"$/i);
        if (match) {
            return { type: 'time', label: match[1] };
        }

        return null;
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
