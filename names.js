(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);

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

    const phoneLayout = {
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 },
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 61,  y: 579, size: 142 },
        "alliance":  { x: 151, y: 584, size: 129 },
        "mail":      { x: 194, y: 538, size: 217 },
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
            pointer-events: auto; cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            -webkit-tap-highlight-color: transparent; user-select: none;
        }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .game-icon:active { transform: scale(0.88) !important; }
        
        /* Стили стрелки (меньше и только в меню) */
        .nav-arrow-min {
            position: fixed; right: 12px; bottom: 20px; width: 22px; height: 22px;
            background: #ffd700; clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10001; cursor: pointer; pointer-events: auto;
            transition: transform 0.3s ease; display: none;
        }
        /* Показываем стрелку только если есть контейнер меню */
        .menu-container ~ .nav-arrow-min, body:has(.menu-container) .nav-arrow-min { display: block; }
        .nav-arrow-min.flip { transform: rotate(180deg); }

        /* Состояния анимации телефона */
        .phone-group-hidden { opacity: 0; pointer-events: none; transform: translateX(100%); }
        .phone-group-out { opacity: 0; pointer-events: none; transform: translateX(-100%); }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};

        if (isTablet) {
            Object.keys(tabletLayout).forEach((id, idx) => {
                const d = tabletLayout[id];
                const icon = createIcon(id, d.x, d.y, d.size, layer);
                icon.style.zIndex = 100 + idx; // Разделяем слои для четкого клика
            });
        } else {
            const p1 = ["quests", "battle", "alliance", "mail"];
            const p2 = ["profile", "rating", "lotto", "benchmark"];

            ["community", "calendar"].forEach(id => {
                createIcon(id, phoneLayout[id].x, phoneLayout[id].y, phoneLayout[id].size, layer);
            });

            p1.forEach(id => {
                refs[id] = createIcon(id, phoneLayout[id].x, phoneLayout[id].y, phoneLayout[id].size, layer);
            });

            p2.forEach((id, i) => {
                const target = phoneLayout[p1[i]]; // Берем координаты первой группы
                const icon = createIcon(id, target.x, target.y, phoneLayout[id].size, layer);
                icon.classList.add('phone-group-hidden');
                refs[id] = icon;
            });

            const arrow = document.createElement('div');
            arrow.className = 'nav-arrow-min';
            let page = 1;
            arrow.onclick = (e) => {
                e.stopPropagation();
                page = page === 1 ? 2 : 1;
                arrow.classList.toggle('flip', page === 2);

                p1.forEach(id => {
                    if (page === 2) refs[id].classList.add('phone-group-out');
                    else refs[id].classList.remove('phone-group-out');
                });
                p2.forEach(id => {
                    if (page === 2) {
                        refs[id].classList.remove('phone-group-hidden');
                        refs[id].style.opacity = "1";
                    } else {
                        refs[id].classList.add('phone-group-hidden');
                        refs[id].style.opacity = "0";
                    }
                });
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const btn = document.createElement('div');
        btn.className = 'game-icon';
        btn.style.width = size + 'px'; btn.style.height = size + 'px';
        btn.style.left = x + 'px'; btn.style.top = y + 'px';
        btn.innerHTML = `<img src="icon_${id}.png">`;
        
        // Улучшенная область клика
        btn.addEventListener('pointerdown', (e) => e.stopPropagation());
        btn.onclick = () => console.log("Click:", id);
        
        parent.appendChild(btn);
        return btn;
    }

    init();
})();
