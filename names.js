(function() {
    const isTablet = window.innerWidth > 768;

    // ТВОИ КООРДИНАТЫ И РАЗМЕРЫ (ПЛАНШЕТ)
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

    // ТВОИ КООРДИНАТЫ И РАЗМЕРЫ (ТЕЛЕФОН)
    const phoneLayout = {
        // Статичные
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 },
        // Группа 1 (Низ)
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 61,  y: 579, size: 142 },
        "alliance":  { x: 151, y: 584, size: 129 },
        "mail":      { x: 194, y: 538, size: 217 },
        // Группа 2 (Низ - заменяют первую группу)
        "profile":   { x: 220, y: 379, size: 167 }, 
        "rating":    { x: 218, y: 286, size: 161 },
        "lotto":     { x: -10, y: 342, size: 165 },
        "benchmark": { x: 227, y: 469, size: 157 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .game-nav-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; }
        .nav-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center; 
            pointer-events: auto; cursor: pointer; transition: transform 0.1s ease, opacity 0.3s ease;
            -webkit-tap-highlight-color: transparent; 
        }
        .nav-icon:active { transform: scale(0.9); }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; }
        
        .side-arrow {
            position: fixed; right: 10px; bottom: 15%; width: 45px; height: 45px;
            background: rgba(255, 215, 0, 0.9); clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 2001; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'};
        }
        .side-arrow.left { transform: rotate(180deg); }
        .hidden-group { opacity: 0; pointer-events: none; transform: translateX(50px); }
    `;
    document.head.appendChild(style);

    function init() {
        const menu = document.querySelector('#menu-screen .menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'game-nav-layer';
        menu.appendChild(layer);

        if (isTablet) {
            // ПЛАНШЕТ - Все 10 иконок сразу
            Object.keys(tabletLayout).forEach(id => {
                const c = tabletLayout[id];
                createIcon(id, c.x, c.y, c.size, layer);
            });
        } else {
            // ТЕЛЕФОН
            const group1Ids = ["quests", "battle", "alliance", "mail"];
            const group2Ids = ["profile", "rating", "lotto", "benchmark"];
            const icons = {};

            // 1. Создаем все иконки
            Object.keys(phoneLayout).forEach(id => {
                const c = phoneLayout[id];
                const btn = createIcon(id, c.x, c.y, c.size, layer);
                icons[id] = btn;

                // Скрываем вторую группу изначально
                if (group2Ids.includes(id)) {
                    btn.classList.add('hidden-group');
                }
            });

            // 2. Стрелка переключения
            const arrow = document.createElement('div');
            arrow.className = 'side-arrow';
            let showGroup2 = false;

            arrow.onclick = () => {
                showGroup2 = !showGroup2;
                arrow.classList.toggle('left', showGroup2);

                group1Ids.forEach(id => {
                    icons[id].style.opacity = showGroup2 ? "0" : "1";
                    icons[id].style.pointerEvents = showGroup2 ? "none" : "auto";
                });
                group2Ids.forEach(id => {
                    icons[id].style.opacity = showGroup2 ? "1" : "0";
                    icons[id].style.pointerEvents = showGroup2 ? "auto" : "none";
                    icons[id].classList.toggle('hidden-group', !showGroup2);
                });
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const btn = document.createElement('div');
        btn.className = 'nav-icon';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.width = size + 'px';
        btn.style.height = size + 'px';
        btn.innerHTML = `<img src="icon_${id}.png">`;
        parent.appendChild(btn);
        return btn;
    }

    init();
})();
