(function() {
    // ЖЕСТКАЯ ПРОВЕРКА УСТРОЙСТВА
    const isTablet = window.innerWidth > 768 || window.screen.width > 768;

    // ТВОИ ДАННЫЕ ДЛЯ ПЛАНШЕТА (БЕЗ ИЗМЕНЕНИЙ)
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

    // ТВОИ ДАННЫЕ ДЛЯ ТЕЛЕФОНА
    const phoneLayout = {
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 },
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 61,  y: 579, size: 142 },
        "alliance":  { x: 151, y: 584, size: 129 },
        "mail":      { x: 194, y: 538, size: 217 },
        // Вторая страница (будут выровнены в ряд программно ниже)
        "profile":   { size: 120 },
        "rating":    { size: 120 },
        "lotto":     { size: 120 },
        "benchmark": { size: 120 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .game-nav-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: hidden; }
        .nav-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center; 
            pointer-events: auto; cursor: pointer; transition: opacity 0.3s ease, transform 0.1s ease;
            -webkit-tap-highlight-color: transparent; 
        }
        .nav-icon:active { transform: scale(0.92); }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; }
        
        .side-arrow-min {
            position: fixed; right: 5px; bottom: 10%; width: 30px; height: 30px;
            background: rgba(255, 215, 0, 0.8); clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 2005; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'}; /* ПЛАНШЕТ СТРЕЛКУ НЕ ВИДИТ */
        }
        .side-arrow-min.rev { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);

    function init() {
        const menu = document.querySelector('#menu-screen .menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'game-nav-layer';
        menu.appendChild(layer);

        const icons = {};

        if (isTablet) {
            // ЛОГИКА ПЛАНШЕТА
            Object.keys(tabletLayout).forEach(id => {
                const c = tabletLayout[id];
                icons[id] = createIcon(id, c.x, c.y, c.size, layer);
            });
        } else {
            // ЛОГИКА ТЕЛЕФОНА
            const group1 = ["quests", "battle", "alliance", "mail"];
            const group2 = ["profile", "rating", "lotto", "benchmark"];

            // Статичные и 1-я группа
            ["community", "calendar", ...group1].forEach(id => {
                const c = phoneLayout[id];
                icons[id] = createIcon(id, c.x, c.y, c.size, layer);
            });

            // 2-я группа: Профиль, Рейтинг, Лото, Эталон (В ряд внизу)
            group2.forEach((id, i) => {
                const c = phoneLayout[id];
                const screenW = window.innerWidth;
                const spacing = screenW / 4;
                const x = (i * spacing) + (spacing / 2) - (c.size / 2);
                const y = window.innerHeight - c.size - 20; // В ряд в самом низу
                
                const btn = createIcon(id, x, y, c.size, layer);
                btn.style.opacity = "0";
                btn.style.pointerEvents = "none";
                icons[id] = btn;
            });

            // Маленькая стрелка
            const arrow = document.createElement('div');
            arrow.className = 'side-arrow-min';
            let state = 1;
            arrow.onclick = () => {
                state = state === 1 ? 2 : 1;
                arrow.classList.toggle('rev', state === 2);
                
                group1.forEach(id => {
                    icons[id].style.opacity = state === 1 ? "1" : "0";
                    icons[id].style.pointerEvents = state === 1 ? "auto" : "none";
                });
                group2.forEach(id => {
                    icons[id].style.opacity = state === 2 ? "1" : "0";
                    icons[id].style.pointerEvents = state === 2 ? "auto" : "none";
                });
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const btn = document.createElement('div');
        btn.className = 'nav-icon';
        btn.style.width = size + 'px';
        btn.style.height = size + 'px';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.innerHTML = `<img src="icon_${id}.png">`;
        parent.appendChild(btn);
        return btn;
    }

    init();
})();
