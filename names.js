(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let activeId = null;

    // ТВОИ ТЕКУЩИЕ ДАННЫЕ
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
        "profile":   { x: 10,  y: 650, size: 110 },
        "rating":    { x: 90,  y: 650, size: 110 },
        "lotto":     { x: 170, y: 650, size: 110 },
        "benchmark": { x: 250, y: 650, size: 110 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: none; transition: opacity 0.3s ease, transform 0.2s ease;
        }
        .game-icon img { 
            width: 100%; height: 100%; object-fit: contain; 
            pointer-events: auto; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .game-icon.editing { border: 2px dashed #00ff00; background: rgba(0,255,0,0.1); }
        
        /* Панель редактора для телефона */
        .edit-panel { 
            position: fixed; top: 10px; left: 10px; z-index: 10001; 
            display: ${isTablet ? 'none' : 'flex'}; flex-direction: column; gap: 5px; 
            background: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px;
        }
        .edit-btn { padding: 10px; background: #ffd700; border: none; font-weight: bold; border-radius: 4px; }

        .nav-arrow-min {
            position: fixed; right: 12px; bottom: 20px; width: 25px; height: 25px;
            background: #ffd700; clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10001; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'};
        }
        .nav-arrow-min.flip { transform: rotate(180deg); }
        .m-hidden { opacity: 0 !important; pointer-events: none !important; transform: translateX(50px); }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};
        const currentData = isTablet ? tabletLayout : phoneLayout;

        // Создание кнопок
        Object.keys(currentData).forEach(id => {
            const d = currentData[id];
            const icon = createIcon(id, d.x, d.y, d.size, layer);
            refs[id] = icon;

            if (!isTablet) {
                // Логика перетаскивания для телефона
                setupDrag(icon, id);
                // Скрываем вторую страницу телефона изначально
                if (["profile", "rating", "lotto", "benchmark"].includes(id)) {
                    icon.classList.add('m-hidden');
                }
            }
        });

        if (!isTablet) {
            // Панель редактора
            const panel = document.createElement('div');
            panel.className = 'edit-panel';
            panel.innerHTML = `
                <button class="edit-btn" id="save-phone">СОХРАНИТЬ ЦИФРЫ</button>
                <div style="display:flex; gap:5px">
                    <button class="edit-btn" onclick="resizeActive(5)">РАЗМЕР +</button>
                    <button class="edit-btn" onclick="resizeActive(-5)">РАЗМЕР -</button>
                </div>
            `;
            document.body.appendChild(panel);
            document.getElementById('save-phone').onclick = () => {
                console.log("ДАННЫЕ ДЛЯ ТЕЛЕФОНА:", JSON.stringify(phoneLayout, null, 2));
                alert("Данные выведены в консоль!");
            };

            // Стрелка переключения
            const arrow = document.createElement('div');
            arrow.className = 'nav-arrow-min';
            let page = 1;
            arrow.onclick = () => {
                page = page === 1 ? 2 : 1;
                arrow.classList.toggle('flip', page === 2);
                const p1 = ["quests", "battle", "alliance", "mail"];
                const p2 = ["profile", "rating", "lotto", "benchmark"];
                p1.forEach(id => refs[id].classList.toggle('m-hidden', page === 2));
                p2.forEach(id => refs[id].classList.toggle('m-hidden', page === 1));
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const btn = document.createElement('div');
        btn.className = 'game-icon';
        btn.id = 'icon-' + id;
        btn.style.width = size + 'px'; btn.style.height = size + 'px';
        btn.style.left = x + 'px'; btn.style.top = y + 'px';
        
        const img = document.createElement('img');
        img.src = `icon_${id}.png`;
        
        btn.appendChild(img);
        parent.appendChild(btn);

        img.onclick = () => {
            if (!isTablet) {
                activeId = id;
                document.querySelectorAll('.game-icon').forEach(el => el.classList.remove('editing'));
                btn.classList.add('editing');
            }
            console.log("Клик:", id);
        };

        return btn;
    }

    window.resizeActive = (delta) => {
        if (activeId) {
            phoneLayout[activeId].size += delta;
            const el = document.getElementById('icon-' + activeId);
            el.style.width = el.style.height = phoneLayout[activeId].size + 'px';
        }
    };

    function setupDrag(el, id) {
        let startX, startY;
        el.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX - phoneLayout[id].x;
            startY = e.touches[0].clientY - phoneLayout[id].y;
            activeId = id;
        });
        el.addEventListener('touchmove', (e) => {
            phoneLayout[id].x = e.touches[0].clientX - startX;
            phoneLayout[id].y = e.touches[0].clientY - startY;
            el.style.left = phoneLayout[id].x + 'px';
            el.style.top = phoneLayout[id].y + 'px';
        });
    }

    init();
})();
