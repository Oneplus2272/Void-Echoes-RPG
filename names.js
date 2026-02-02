(function() {
    // ЖЕСТКАЯ ПРОВЕРКА: Планшет или Телефон
    const isTablet = window.innerWidth > 1024; 

    // 1. ТВОИ ДАННЫЕ ДЛЯ ПЛАНШЕТА (БЕЗ ИЗМЕНЕНИЙ)
    const tabletData = {
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

    // 2. ТВОИ ДАННЫЕ ДЛЯ ТЕЛЕФОНА
    const phoneData = {
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 },
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 61,  y: 579, size: 142 },
        "alliance":  { x: 151, y: 584, size: 129 },
        "mail":      { x: 194, y: 538, size: 217 },
        // Вторая страница (низ)
        "profile":   { size: 110 },
        "rating":    { size: 110 },
        "lotto":     { size: 110 },
        "benchmark": { size: 110 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .icon { 
            position: absolute; pointer-events: auto; cursor: pointer; 
            transition: transform 0.1s ease, opacity 0.2s ease;
            -webkit-tap-highlight-color: transparent; 
            display: flex; align-items: center; justify-content: center;
        }
        .icon:active { transform: scale(0.9); }
        .icon img { width: 100%; height: 100%; object-fit: contain; }
        
        .m-arrow {
            position: fixed; right: 10px; bottom: 50px; width: 35px; height: 35px;
            background: #ffd700; clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10000; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'};
        }
        .m-arrow.back { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);

    function build() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-layer';
        container.appendChild(layer);

        const storage = {};

        if (isTablet) {
            // ПЛАНШЕТ: Просто ставим иконки по твоим X, Y, Size
            Object.keys(tabletData).forEach(id => {
                const d = tabletData[id];
                const el = createEl(id, d.x, d.y, d.size, layer);
                storage[id] = el;
            });
        } else {
            // ТЕЛЕФОН
            const g1 = ["quests", "battle", "alliance", "mail"];
            const g2 = ["profile", "rating", "lotto", "benchmark"];

            // Статичные и первая группа
            ["community", "calendar", ...g1].forEach(id => {
                const d = phoneData[id];
                storage[id] = createEl(id, d.x, d.y, d.size, layer);
            });

            // Вторая группа (выравнивание в ряд внизу)
            g2.forEach((id, i) => {
                const d = phoneData[id];
                const x = (i * (window.innerWidth / 4)) + 10;
                const y = window.innerHeight - d.size - 30;
                const el = createEl(id, x, y, d.size, layer);
                el.style.opacity = "0";
                el.style.pointerEvents = "none";
                storage[id] = el;
            });

            // Маленькая стрелка для телефона
            const arrow = document.createElement('div');
            arrow.className = 'm-arrow';
            let page = 1;
            arrow.onclick = () => {
                page = page === 1 ? 2 : 1;
                arrow.classList.toggle('back', page === 2);
                g1.forEach(id => { 
                    storage[id].style.opacity = page === 1 ? "1" : "0";
                    storage[id].style.pointerEvents = page === 1 ? "auto" : "none";
                });
                g2.forEach(id => { 
                    storage[id].style.opacity = page === 2 ? "1" : "0";
                    storage[id].style.pointerEvents = page === 2 ? "auto" : "none";
                });
            };
            document.body.appendChild(arrow);
        }
    }

    function createEl(id, x, y, size, parent) {
        const div = document.createElement('div');
        div.className = 'icon';
        div.style.width = size + 'px';
        div.style.height = size + 'px';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.innerHTML = `<img src="icon_${id}.png">`;
        parent.appendChild(div);
        return div;
    }

    build();
})();
