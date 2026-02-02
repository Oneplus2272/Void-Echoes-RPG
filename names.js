(function() {
    // ЖЕСТКАЯ ПРОВЕРКА УСТРОЙСТВА
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);

    // КООРДИНАТЫ ПЛАНШЕТА (СТРОГО ПО ТВОИМ ДАННЫМ)
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

    // КООРДИНАТЫ ТЕЛЕФОНА (СТРОГО ПО ТВОИМ ДАННЫМ)
    const phoneLayout = {
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 },
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 61,  y: 579, size: 142 },
        "alliance":  { x: 151, y: 584, size: 129 },
        "mail":      { x: 194, y: 538, size: 217 },
        // Вторая страница (размеры из твоих данных, позиция - в ряд)
        "profile":   { size: 167 },
        "rating":    { size: 161 },
        "lotto":     { size: 165 },
        "benchmark": { size: 157 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; cursor: pointer; transition: transform 0.1s ease, opacity 0.3s ease;
            -webkit-tap-highlight-color: transparent; outline: none;
        }
        .game-icon:active { transform: scale(0.9); }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        
        .nav-arrow-min {
            position: fixed; right: 10px; bottom: 30px; width: 35px; height: 35px;
            background: #ffd700; clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10000; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'};
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .nav-arrow-min.flip { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);

    function initUI() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};

        if (isTablet) {
            // ПЛАНШЕТ: Просто выводим всё по списку без условий
            Object.keys(tabletLayout).forEach(id => {
                const d = tabletLayout[id];
                createIcon(id, d.x, d.y, d.size, layer);
            });
        } else {
            // ТЕЛЕФОН: Слайдер страниц
            const p1 = ["quests", "battle", "alliance", "mail"];
            const p2 = ["profile", "rating", "lotto", "benchmark"];

            // Статичные (верх)
            ["community", "calendar"].forEach(id => {
                const d = phoneLayout[id];
                createIcon(id, d.x, d.y, d.size, layer);
            });

            // Страница 1 (низ)
            p1.forEach(id => {
                const d = phoneLayout[id];
                refs[id] = createIcon(id, d.x, d.y, d.size, layer);
            });

            // Страница 2 (низ - в ряд)
            p2.forEach((id, i) => {
                const d = phoneLayout[id];
                const screenW = window.innerWidth;
                const x = (i * (screenW / 4)) + 5;
                const y = window.innerHeight - (d.size * 0.9) - 40;
                
                const icon = createIcon(id, x, y, d.size, layer);
                icon.style.opacity = "0";
                icon.style.pointerEvents = "none";
                refs[id] = icon;
            });

            // Стрелка переключения
            const arrow = document.createElement('div');
            arrow.className = 'nav-arrow-min';
            let curPage = 1;
            arrow.onclick = () => {
                curPage = curPage === 1 ? 2 : 1;
                arrow.classList.toggle('flip', curPage === 2);
                p1.forEach(id => {
                    refs[id].style.opacity = curPage === 1 ? "1" : "0";
                    refs[id].style.pointerEvents = curPage === 1 ? "auto" : "none";
                });
                p2.forEach(id => {
                    refs[id].style.opacity = curPage === 2 ? "1" : "0";
                    refs[id].style.pointerEvents = curPage === 2 ? "auto" : "none";
                });
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const div = document.createElement('div');
        div.className = 'game-icon';
        div.style.width = size + 'px';
        div.style.height = size + 'px';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.innerHTML = `<img src="icon_${id}.png">`;
        parent.appendChild(div);
        return div;
    }

    initUI();
})();
