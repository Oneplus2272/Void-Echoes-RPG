(function() {
    // ЖЕСТКАЯ ПРОВЕРКА УСТРОЙСТВА
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);

    // КООРДИНАТЫ ПЛАНШЕТА (БЕЗ ИЗМЕНЕНИЙ)
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
        // Группа 2 (размеры твои, позиции будут подменены)
        "profile":   { size: 167 },
        "rating":    { size: 161 },
        "lotto":     { size: 165 },
        "benchmark": { size: 157 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; user-select: none; -webkit-user-select: none; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; cursor: pointer; transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
            -webkit-tap-highlight-color: transparent; outline: none; touch-action: manipulation;
        }
        .game-icon:active { transform: scale(0.85); }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        
        .nav-arrow-min {
            position: fixed; right: 8px; bottom: 25px; width: 25px; height: 25px;
            background: rgba(255, 215, 0, 0.9); clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10000; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'};
            transition: transform 0.3s ease;
        }
        .nav-arrow-min.flip { transform: rotate(180deg); }
        .slide-out { opacity: 0 !important; pointer-events: none !important; transform: translateX(-20px) scale(0.8); }
        .slide-in { opacity: 1 !important; pointer-events: auto !important; transform: translateX(0) scale(1); }
    `;
    document.head.appendChild(style);

    function initUI() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};

        if (isTablet) {
            Object.keys(tabletLayout).forEach(id => {
                const d = tabletLayout[id];
                createIcon(id, d.x, d.y, d.size, layer);
            });
        } else {
            const p1Ids = ["quests", "battle", "alliance", "mail"];
            const p2Ids = ["profile", "rating", "lotto", "benchmark"];

            // Статичные верхние
            ["community", "calendar"].forEach(id => {
                const d = phoneLayout[id];
                createIcon(id, d.x, d.y, d.size, layer);
            });

            // Страница 1
            p1Ids.forEach(id => {
                const d = phoneLayout[id];
                refs[id] = createIcon(id, d.x, d.y, d.size, layer);
            });

            // Страница 2 (Выравниваем точно по местам первой группы)
            p2Ids.forEach((id, i) => {
                const d = phoneLayout[id];
                const targetId = p1Ids[i]; // Берем координаты соответствующей иконки из p1
                const targetPos = phoneLayout[targetId];
                
                const icon = createIcon(id, targetPos.x, targetPos.y, d.size, layer);
                icon.style.opacity = "0";
                icon.style.pointerEvents = "none";
                icon.classList.add('slide-out');
                refs[id] = icon;
            });

            // Маленькая стрелка
            const arrow = document.createElement('div');
            arrow.className = 'nav-arrow-min';
            let currentPage = 1;
            
            arrow.onclick = (e) => {
                e.stopPropagation();
                currentPage = currentPage === 1 ? 2 : 1;
                arrow.classList.toggle('flip', currentPage === 2);
                
                p1Ids.forEach(id => {
                    if(currentPage === 1) refs[id].classList.remove('slide-out');
                    else refs[id].classList.add('slide-out');
                });
                p2Ids.forEach(id => {
                    if(currentPage === 2) {
                        refs[id].classList.remove('slide-out');
                        refs[id].classList.add('slide-in');
                    } else {
                        refs[id].classList.add('slide-out');
                        refs[id].classList.remove('slide-in');
                    }
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
        
        // Четкий проклик
        div.addEventListener('click', (e) => {
            console.log("Action:", id);
            // Здесь вызывай свои функции открытия окон
        });
        
        parent.appendChild(div);
        return div;
    }

    initUI();
})();
