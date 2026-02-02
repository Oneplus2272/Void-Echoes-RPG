(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);

    // КООРДИНАТЫ ПЛАНШЕТА (ЖЕСТКАЯ ФИКСАЦИЯ ИЗОЛЯЦИИ КЛИКОВ)
    const tabletLayout = {
        "profile":   { x: 367, y: 936, size: 154 },
        "battle":    { x: 81,  y: 938, size: 150 },
        "quests":    { x: -9,  y: 938, size: 139 },
        "calendar":  { x: -21, y: 314, size: 161 },
        "alliance":  { x: 179, y: 938, size: 147 },
        "community": { x: -17, y: 211, size: 144 },
        "mail":      { x: 230, y: 891, size: 234 },
        "rating":    { x: -24, y: 88,  size: 159 },
        "benchmark": { x: 571, y: 924, size: 152 },
        "lotto":     { x: 468, y: 930, size: 159 }
    };

    // КООРДИНАТЫ ТЕЛЕФОНА (ГОТОВЫ К ТВОИМ ПРАВКАМ)
    const phoneStatic = {
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 },
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 61,  y: 579, size: 142 },
        "alliance":  { x: 151, y: 584, size: 129 },
        "mail":      { x: 194, y: 538, size: 217 }
    };

    // СЮДА ДАЙ МНЕ ЦИФРЫ ДЛЯ ЭТИХ 4 ИКОНОК:
    const phoneEditGroup = {
        "profile":   { x: 0, y: 0, size: 150 }, // Жду твои x, y, size
        "rating":    { x: 0, y: 0, size: 150 }, 
        "lotto":     { x: 0, y: 0, size: 150 }, 
        "benchmark": { x: 0, y: 0, size: 150 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            -webkit-tap-highlight-color: transparent; outline: none;
        }
        .game-icon:active { transform: scale(0.9); }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        
        .nav-arrow-min {
            position: fixed; right: 10px; bottom: 25px; width: 25px; height: 25px;
            background: #ffd700; clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10001; cursor: pointer; pointer-events: auto; display: none;
        }
        body:has(.menu-container) .nav-arrow-min { display: block; }
        .nav-arrow-min.flip { transform: rotate(180deg); }

        .m-hidden { opacity: 0; pointer-events: none; transform: translateX(50px); }
        .m-out { opacity: 0; pointer-events: none; transform: translateX(-50px); }
    `;
    document.head.appendChild(style);

    function initUI() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};

        if (isTablet) {
            // ПЛАНШЕТ: Максимально изолированные клики
            Object.keys(tabletLayout).forEach((id, i) => {
                const d = tabletLayout[id];
                const el = createIcon(id, d.x, d.y, d.size, layer);
                el.style.zIndex = 100 + i;
            });
        } else {
            // ТЕЛЕФОН
            const p1Ids = ["quests", "battle", "alliance", "mail"];
            const p2Ids = Object.keys(phoneEditGroup);

            ["community", "calendar"].forEach(id => createIcon(id, phoneStatic[id].x, phoneStatic[id].y, phoneStatic[id].size, layer));

            p1Ids.forEach(id => {
                refs[id] = createIcon(id, phoneStatic[id].x, phoneStatic[id].y, phoneStatic[id].size, layer);
            });

            p2Ids.forEach(id => {
                const d = phoneEditGroup[id];
                const el = createIcon(id, d.x, d.y, d.size, layer);
                el.classList.add('m-hidden');
                refs[id] = el;
            });

            const arrow = document.createElement('div');
            arrow.className = 'nav-arrow-min';
            let p = 1;
            arrow.onclick = (e) => {
                e.stopPropagation();
                p = p === 1 ? 2 : 1;
                arrow.classList.toggle('flip', p === 2);
                p1Ids.forEach(id => p === 2 ? refs[id].classList.add('m-out') : refs[id].classList.remove('m-out'));
                p2Ids.forEach(id => p === 2 ? refs[id].classList.remove('m-hidden') : refs[id].classList.add('m-hidden'));
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const div = document.createElement('div');
        div.className = 'game-icon';
        div.style.width = size + 'px'; div.style.height = size + 'px';
        div.style.left = x + 'px'; div.style.top = y + 'px';
        div.innerHTML = `<img src="icon_${id}.png">`;
        div.onclick = () => console.log("Клик по:", id);
        parent.appendChild(div);
        return div;
    }

    initUI();
})();
