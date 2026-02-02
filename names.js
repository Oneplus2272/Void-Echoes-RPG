(function() {
    const isTablet = window.innerWidth > 768;

    // Твои сохраненные координаты с планшета
    const tabletLayout = [
        { "id": "profile",   "x": 367, "y": 936, "size": 154 },
        { "id": "battle",    "x": 81,  "y": 938, "size": 150 },
        { "id": "quests",    "x": -9,  "y": 938, "size": 139 },
        { "id": "calendar",  "x": -21, "y": 314, "size": 161 },
        { "id": "alliance",  "x": 179, "y": 938, "size": 147 },
        { "id": "community", "x": -17, "y": 211, "size": 144 },
        { "id": "mail",      "x": 230, "y": 891, "size": 234 },
        { "id": "rating",    "x": -24, "y": 88,  "size": 159 },
        { "id": "benchmark", "x": 571, "y": 924, "size": 152 },
        { "id": "lotto",     "x": 468, "y": 930, "size": 159 }
    ];

    const style = document.createElement('style');
    style.innerHTML = `
        .game-nav-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 1000;
        }
        .nav-icon {
            position: absolute; display: flex; align-items: center; justify-content: center;
            touch-action: none; pointer-events: auto; cursor: pointer;
        }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; }
        
        /* Сетка для телефона */
        @media (max-width: 768px) {
            .nav-icon { position: fixed !important; }
        }
    `;
    document.head.appendChild(style);

    function initFinalLayout() {
        const menu = document.querySelector('#menu-screen .menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'game-nav-layer';
        menu.appendChild(layer);

        tabletLayout.forEach((data, index) => {
            const btn = document.createElement('div');
            btn.className = 'nav-icon';
            btn.id = 'btn-' + data.id;

            if (isTablet) {
                // Применяем твои координаты для планшета
                btn.style.left = data.x + 'px';
                btn.style.top = data.y + 'px';
                btn.style.width = data.size + 'px';
                btn.style.height = data.size + 'px';
            } else {
                // Сетка для телефона: 2 ряда по 5 иконок внизу
                const col = index % 5;
                const row = Math.floor(index / 5);
                const iconSize = window.innerWidth / 6; // Авто-размер под экран
                
                btn.style.width = btn.style.height = iconSize + 'px';
                btn.style.left = (col * (window.innerWidth / 5)) + 'px';
                btn.style.bottom = (row * (iconSize + 10) + 20) + 'px';
            }

            btn.innerHTML = `<img src="icon_${data.id}.png" alt="${data.id}">`;
            
            // Сюда вешаем действия (пример)
            btn.onclick = () => {
                if (data.id === 'profile') openInventory();
                console.log('Нажато:', data.id);
            };

            layer.appendChild(btn);
        });
    }

    initFinalLayout();
})();
